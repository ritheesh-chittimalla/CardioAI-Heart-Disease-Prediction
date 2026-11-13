
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = BASE_DIR / "data" / "raw" / "processed.cleveland.data"

columns = [
    "age", "sex", "cp", "trestbps",
    "chol", "fbs", "restecg", "thalach",
    "exang", "oldpeak", "slope", "ca",
    "thal", "num"
]

# Load dataset
df = pd.read_csv(
    DATA_PATH,
    names=columns,
    na_values="?"
)

for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Convert target into binary classification
df["target"] = (df["num"] > 0).astype(int)

sns.set_theme(style="whitegrid")

# 1. Target distribution
plt.figure(figsize=(7, 5))

sns.countplot(data=df, x="target")

plt.title("Heart Disease Distribution")
plt.xlabel("0 = No Disease, 1 = Disease")
plt.ylabel("Number of Patients")

plt.tight_layout()
plt.show()


# 2. Age distribution by target
plt.figure(figsize=(8, 5))

sns.histplot(
    data=df,
    x="age",
    hue="target",
    bins=20,
    kde=True,
    multiple="layer"
)

plt.title("Age Distribution by Heart Disease Status")
plt.xlabel("Age")
plt.ylabel("Frequency")

plt.tight_layout()
plt.show()


# 3. Cholesterol comparison
plt.figure(figsize=(8, 5))

sns.boxplot(
    data=df,
    x="target",
    y="chol"
)

plt.title("Cholesterol vs Heart Disease")
plt.xlabel("Heart Disease Status")
plt.ylabel("Cholesterol")

plt.tight_layout()
plt.show()


# 4. Correlation heatmap
plt.figure(figsize=(12, 8))

correlation = df.corr(numeric_only=True)

sns.heatmap(
    correlation,
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Feature Correlation Heatmap")

plt.tight_layout()
plt.show()


# Dataset summary
print("\nTarget Distribution:")
print(df["target"].value_counts())

print("\nTarget Percentages:")
print(df["target"].value_counts(normalize=True) * 100)

print("\nEDA completed successfully!")
