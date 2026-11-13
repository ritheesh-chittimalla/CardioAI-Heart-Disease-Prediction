
import pandas as pd
from pathlib import Path

# Get project root directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Dataset path
DATA_PATH = BASE_DIR / "data" / "raw" / "processed.cleveland.data"

# Column names
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

# Convert all columns to numeric
for col in columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Display dataset
print("Dataset loaded successfully!")

print("\nDataset Shape:")
print(df.shape)

print("\nFirst 5 Rows:")
print(df.head())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDataset Information:")
print(df.info())
