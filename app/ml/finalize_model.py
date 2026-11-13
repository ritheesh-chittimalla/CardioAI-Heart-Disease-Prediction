
import joblib

from pathlib import Path

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from app.ml.preprocess import load_data, build_preprocessor


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"

THRESHOLD = 0.40


def finalize_model():

    X, y = load_data()

    # Recreate the original train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    # Build final pipeline
    model = Pipeline([
        ("preprocessor", build_preprocessor()),
        ("classifier", LogisticRegression(
            max_iter=1000,
            random_state=42
        ))
    ])

    # Train using training data only
    model.fit(X_train, y_train)

    # Generate probabilities on independent test data
    probabilities = model.predict_proba(X_test)[:, 1]

    # Apply the previously selected threshold
    predictions = (probabilities >= THRESHOLD).astype(int)

    print("\nFINAL MODEL EVALUATION")
    print("=" * 45)

    print("Threshold:", THRESHOLD)

    print("Accuracy:",
          round(accuracy_score(y_test, predictions), 4))

    print("Precision:",
          round(precision_score(y_test, predictions), 4))

    print("Recall:",
          round(recall_score(y_test, predictions), 4))

    print("F1 Score:",
          round(f1_score(y_test, predictions), 4))

    print("ROC-AUC:",
          round(roc_auc_score(y_test, probabilities), 4))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, predictions))

    print("\nClassification Report:")
    print(classification_report(y_test, predictions))

    # Save the trained pipeline
    artifact = {
        "model": model,
        "threshold": THRESHOLD,
        "model_name": "Logistic Regression",
        "version": "1.0"
    }

    joblib.dump(artifact, MODEL_PATH)

    print("\nFinal model saved at:", MODEL_PATH)


if __name__ == "__main__":
    finalize_model()
