
import joblib
import numpy as np

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve,
)

from app.ml.preprocess import load_data


BASE_DIR = Path(__file__).resolve().parents[2]

LOGISTIC_PATH = BASE_DIR / "models" / "logistic_regression.joblib"
RANDOM_FOREST_PATH = BASE_DIR / "models" / "random_forest.joblib"


def load_model_artifact(path):
    artifact = joblib.load(path)

    # The Logistic Regression artifact contains metadata and a model.
    # The earlier Random Forest artifact may be a Pipeline directly.
    if isinstance(artifact, dict):
        model = artifact["model"]
        model_name = artifact.get("model_name", path.stem)
        version = artifact.get("version", "1.0")
        threshold = float(artifact.get("threshold", 0.5))
    else:
        model = artifact
        model_name = path.stem.replace("_", " ").title()
        version = "1.0"
        threshold = 0.5

    return model, model_name, version, threshold


def evaluate_single_model(model, model_name, version, threshold, X_test, y_test):
    probabilities = model.predict_proba(X_test)[:, 1]

    predictions = (probabilities >= threshold).astype(int)

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=[0, 1]
    )

    fpr, tpr, thresholds = roc_curve(y_test, probabilities)

    return {
        "model_name": model_name,
        "model_version": version,
        "classification_threshold": threshold,

        "metrics": {
            "accuracy": round(
                float(accuracy_score(y_test, predictions)), 4
            ),
            "precision": round(
                float(precision_score(
                    y_test, predictions, zero_division=0
                )), 4
            ),
            "recall": round(
                float(recall_score(
                    y_test, predictions, zero_division=0
                )), 4
            ),
            "f1_score": round(
                float(f1_score(
                    y_test, predictions, zero_division=0
                )), 4
            ),
            "roc_auc": round(
                float(roc_auc_score(y_test, probabilities)), 4
            ),
        },

        "confusion_matrix": {
            "labels": ["Negative", "Positive"],
            "matrix": matrix.tolist(),
        },

        "roc_curve": [
            {
                "false_positive_rate": round(float(x), 4),
                "true_positive_rate": round(float(y), 4),
            }
            for x, y in zip(fpr, tpr)
        ],

        "test_records": int(len(y_test)),
    }


def get_model_evaluation():
    X, y = load_data()

    # Recreate the same stratified test split used during model development.
    _, X_test, _, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    logistic_model, logistic_name, logistic_version, logistic_threshold = (
        load_model_artifact(LOGISTIC_PATH)
    )

    random_forest_model, rf_name, rf_version, rf_threshold = (
        load_model_artifact(RANDOM_FOREST_PATH)
    )

    logistic_results = evaluate_single_model(
        logistic_model,
        logistic_name,
        logistic_version,
        logistic_threshold,
        X_test,
        y_test,
    )

    random_forest_results = evaluate_single_model(
        random_forest_model,
        rf_name,
        rf_version,
        rf_threshold,
        X_test,
        y_test,
    )

    return {
        "evaluation_type": "Preliminary evaluation",
        "dataset": "Cleveland Heart Disease dataset",
        "total_dataset_records": int(len(X)),
        "test_records": int(len(X_test)),

        "evaluation_note": (
            "The test set was examined during earlier model development. "
            "These results are preliminary and are not independent "
            "external validation."
        ),

        "models": [
            logistic_results,
            random_forest_results,
        ],
    }
