
import joblib
import shap
import numpy as np

from pathlib import Path
from sklearn.model_selection import train_test_split

from app.ml.preprocess import (
    load_data,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES
)


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"


def get_original_feature(transformed_name):

    name = transformed_name.split("__", 1)[-1]

    for feature in CATEGORICAL_FEATURES:
        if name.startswith(feature + "_"):
            return feature

    for feature in NUMERICAL_FEATURES:
        if name == feature:
            return feature

    return name


def get_feature_importance():

    artifact = joblib.load(MODEL_PATH)
    pipeline = artifact["model"]

    X, y = load_data()

    X_train, X_test, _, _ = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]

    X_train_transformed = preprocessor.transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)

    feature_names = preprocessor.get_feature_names_out()

    explainer = shap.LinearExplainer(
        classifier,
        X_train_transformed
    )

    shap_values = explainer(X_test_transformed).values

    # Group encoded columns by their original feature
    grouped_indices = {}

    for index, name in enumerate(feature_names):

        original_feature = get_original_feature(name)

        grouped_indices.setdefault(
            original_feature, []
        ).append(index)

    results = []

    for feature, indices in grouped_indices.items():

        # Combine contributions from all encoded columns
        grouped_values = np.sum(
            shap_values[:, indices],
            axis=1
        )

        importance = float(
            np.mean(np.abs(grouped_values))
        )

        results.append({
            "feature": feature,
            "importance": round(importance, 4)
        })

    results.sort(
        key=lambda item: item["importance"],
        reverse=True
    )

    return {
        "model_name": artifact["model_name"],
        "model_version": artifact["version"],
        "importance_method": "Mean absolute grouped SHAP value",
        "features": results
    }
