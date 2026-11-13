
import joblib
import shap
import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.model_selection import train_test_split

from app.ml.preprocess import load_data


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"

# Load the saved model artifact
artifact = joblib.load(MODEL_PATH)

model = artifact["model"]
threshold = artifact["threshold"]

preprocessor = model.named_steps["preprocessor"]
classifier = model.named_steps["classifier"]


# Prepare background data for SHAP
X, y = load_data()

X_train, _, _, _ = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

X_train_transformed = preprocessor.transform(X_train)

# Create explainer once when the service loads
explainer = shap.LinearExplainer(
    classifier,
    X_train_transformed
)

feature_names = preprocessor.get_feature_names_out()


def explain_prediction(patient_data: dict):

    # Convert patient input into a DataFrame
    input_df = pd.DataFrame([patient_data])

    # Apply the same preprocessing used during training
    transformed_input = preprocessor.transform(input_df)

    # Generate SHAP explanation
    shap_values = explainer(transformed_input)

    contributions = shap_values.values[0]

    # Get prediction and probability
    probability = float(
        model.predict_proba(input_df)[0][1]
    )

    prediction = int(probability >= threshold)

    # Calculate model output in log-odds space
    model_output = float(
        classifier.decision_function(transformed_input)[0]
    )

    baseline = float(
        np.asarray(shap_values.base_values).reshape(-1)[0]
    )

    # Prepare feature contributions
    feature_contributions = []

    for name, value, contribution in zip(
        feature_names,
        transformed_input.toarray()[0]
        if hasattr(transformed_input, "toarray")
        else transformed_input[0],
        contributions
    ):

        feature_contributions.append({
            "feature": str(name),
            "feature_value": float(value),
            "shap_value": float(contribution),
            "direction": (
                "increases_class_1_output"
                if contribution > 0
                else "decreases_class_1_output"
                if contribution < 0
                else "no_contribution"
            )
        })

    # Sort by absolute SHAP contribution
    feature_contributions.sort(
        key=lambda item: abs(item["shap_value"]),
        reverse=True
    )

    return {
        "prediction": prediction,
        "result": (
            "Disease indicated by the model"
            if prediction == 1
            else "No disease indicated by the model"
        ),
        "estimated_probability": round(probability, 4),
        "classification_threshold": threshold,
        "model_name": artifact["model_name"],
        "model_version": artifact["version"],
        "explanation": {
            "baseline_log_odds": round(baseline, 4),
            "model_output_log_odds": round(model_output, 4),
            "top_feature_contributions": feature_contributions[:10]
        },
        "disclaimer": (
            "Experimental model explanation only. "
            "Not a medical diagnosis or clinical recommendation."
        )
    }
