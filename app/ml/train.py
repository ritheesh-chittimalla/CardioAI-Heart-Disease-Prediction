
import joblib

from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

from app.ml.preprocess import split_data, build_preprocessor


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)


def train_and_evaluate(model_name, classifier, X_train, X_test, y_train, y_test):

    print(f"\n{'=' * 50}")
    print(f"Training: {model_name}")
    print(f"{'=' * 50}")

    pipeline = Pipeline([
        ("preprocessor", build_preprocessor()),
        ("classifier", classifier)
    ])

    # Train the complete pipeline
    pipeline.fit(X_train, y_train)

    # Generate predictions
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    # Calculate evaluation metrics
    print("\nEvaluation Metrics")

    print("Accuracy:", round(accuracy_score(y_test, y_pred), 4))
    print("Precision:", round(precision_score(y_test, y_pred, zero_division=0), 4))
    print("Recall:", round(recall_score(y_test, y_pred, zero_division=0), 4))
    print("F1 Score:", round(f1_score(y_test, y_pred, zero_division=0), 4))
    print("ROC-AUC:", round(roc_auc_score(y_test, y_prob), 4))

    print("\nClassification Report")
    print(classification_report(y_test, y_pred, zero_division=0))

    print("Confusion Matrix")
    print(confusion_matrix(y_test, y_pred))

    # Save the complete pipeline
    model_path = MODEL_DIR / f"{model_name}.joblib"
    joblib.dump(pipeline, model_path)

    print(f"\nModel saved at: {model_path}")

    return pipeline


def main():

    X_train, X_test, y_train, y_test = split_data()

    print("Training data shape:", X_train.shape)
    print("Testing data shape:", X_test.shape)

    models = {
        "logistic_regression": LogisticRegression(
            max_iter=1000,
            random_state=42
        ),

        "random_forest": RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            n_jobs=-1
        )
    }

    for model_name, classifier in models.items():

        train_and_evaluate(
            model_name,
            classifier,
            X_train,
            X_test,
            y_train,
            y_test
        )


if __name__ == "__main__":
    main()
