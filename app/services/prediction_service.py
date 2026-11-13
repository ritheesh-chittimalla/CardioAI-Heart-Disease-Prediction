
import joblib
import pandas as pd

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"

# Load the saved model artifact
artifact = joblib.load(MODEL_PATH)

model = artifact["model"]
THRESHOLD = artifact["threshold"]


def predict_heart_disease(patient_data: dict):

    input_df = pd.DataFrame([patient_data])

    # Get probability for positive class
    probability = float(
        model.predict_proba(input_df)[0][1]
    )

    # Apply the selected threshold
    prediction = int(probability >= THRESHOLD)

    return {
        "prediction": prediction,
        "result": (
            "Disease indicated by the model"
            if prediction == 1
            else "No disease indicated by the model"
        ),
        "estimated_probability": round(probability, 4),
        "classification_threshold": THRESHOLD,
        "model_name": artifact["model_name"],
        "model_version": artifact["version"]
    }
