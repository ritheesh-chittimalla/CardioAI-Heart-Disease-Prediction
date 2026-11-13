
import joblib
import shap
import matplotlib.pyplot as plt

from pathlib import Path
from sklearn.model_selection import train_test_split

from app.ml.preprocess import load_data


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "logistic_regression.joblib"

FIGURE_DIR = BASE_DIR / "reports" / "figures"
FIGURE_DIR.mkdir(parents=True, exist_ok=True)


def explain_model():

    # Load trained model artifact
    artifact = joblib.load(MODEL_PATH)
    pipeline = artifact["model"]

    # Load dataset
    X, y = load_data()

    # Recreate original train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    # Extract preprocessing and classifier
    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]

    # Transform dataset
    X_train_transformed = preprocessor.transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)

    # Get transformed feature names
    feature_names = preprocessor.get_feature_names_out()

    # Create SHAP explainer
    explainer = shap.LinearExplainer(
        classifier,
        X_train_transformed
    )

    # Calculate SHAP values
    shap_values = explainer(X_test_transformed)

    print("\nSHAP EXPLAINABILITY")
    print("=" * 45)

    print("Original features:", X.shape[1])
    print("Transformed features:", len(feature_names))
    print("Test records explained:", X_test.shape[0])

    # 1. SHAP Summary Plot
    shap.summary_plot(
        shap_values.values,
        X_test_transformed,
        feature_names=feature_names,
        show=False
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR / "shap_summary.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

    # 2. SHAP Feature Importance Bar Plot
    shap.summary_plot(
        shap_values.values,
        X_test_transformed,
        feature_names=feature_names,
        plot_type="bar",
        show=False
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR / "shap_feature_importance.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

    # 3. Individual SHAP Waterfall Plot
    individual_explanation = shap.Explanation(
        values=shap_values.values[0],
        base_values=shap_values.base_values[0],
        data=X_test_transformed[0],
        feature_names=feature_names
    )

    shap.plots.waterfall(
        individual_explanation,
        max_display=15,
        show=False
    )

    plt.tight_layout()

    plt.savefig(
        FIGURE_DIR / "shap_waterfall.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

    print("\nSHAP plots saved successfully.")
    print("Output directory:", FIGURE_DIR)


if __name__ == "__main__":
    explain_model()
