
import numpy as np

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_predict
)

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from app.ml.preprocess import load_data, build_preprocessor


def analyze_thresholds():

    X, y = load_data()

    # Keep the independent test set untouched
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    model = Pipeline([
        ("preprocessor", build_preprocessor()),
        ("classifier", LogisticRegression(
            max_iter=1000,
            random_state=42
        ))
    ])

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42
    )

    # Generate out-of-fold probabilities on training data
    probabilities = cross_val_predict(
        model,
        X_train,
        y_train,
        cv=cv,
        method="predict_proba",
        n_jobs=1
    )[:, 1]

    thresholds = [0.30, 0.40, 0.50, 0.60, 0.70]

    print("\nCLASSIFICATION THRESHOLD ANALYSIS")
    print("=" * 55)

    for threshold in thresholds:

        predictions = (
            probabilities >= threshold
        ).astype(int)

        accuracy = accuracy_score(y_train, predictions)

        precision = precision_score(
            y_train,
            predictions,
            zero_division=0
        )

        recall = recall_score(
            y_train,
            predictions,
            zero_division=0
        )

        f1 = f1_score(
            y_train,
            predictions,
            zero_division=0
        )

        matrix = confusion_matrix(
            y_train,
            predictions,
            labels=[0, 1]
        )

        print(f"\nThreshold: {threshold:.2f}")
        print("Accuracy:", round(accuracy, 4))
        print("Precision:", round(precision, 4))
        print("Recall:", round(recall, 4))
        print("F1 Score:", round(f1, 4))
        print("Confusion Matrix:")
        print(matrix)


if __name__ == "__main__":
    analyze_thresholds()
