# CardioAI: Heart Disease Prediction System

An experimental machine learning application for heart disease classification and explainable AI.

## Overview

CardioAI is an educational machine learning project that uses classification algorithms to identify patterns associated with heart disease in the Cleveland Heart Disease dataset.

The application accepts 13 input features and provides:
- Binary classification output.
- Estimated probability of class 1.
- SHAP-based individual prediction explanations.
- Global feature importance analysis.
- Model evaluation metrics and visualizations.

**Important:** This is an experimental research prototype. It is not a medical diagnostic tool and must not be used for clinical decisions.

## Technology Stack

| Layer | Technologies |
|---|---|
| Programming | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Explainable AI | SHAP |
| Backend | FastAPI |
| Frontend | React, Vite |
| Charts | Recharts |
| HTTP Client | Axios |

## Dataset

The project uses the Cleveland subset of the UCI Heart Disease dataset.

- Total records: 303
- Input features: 13
- Target classes: 2

Dataset source: https://archive.ics.uci.edu/dataset/45/heart+disease

The original target is converted into a binary classification target:
- 0: Negative class
- 1: Positive class

## Machine Learning Models

Two classification algorithms were evaluated:

1. Logistic Regression
2. Random Forest

Logistic Regression was selected as the primary model.

The classification threshold is provisionally set to 0.40.

## Model Evaluation

Preliminary Logistic Regression test results:

| Metric | Result |
|---|---:|
| Accuracy | 88.52% |
| Precision | 81.82% |
| Recall | 96.43% |
| F1 Score | 88.52% |
| ROC-AUC | 96.65% |

These results are preliminary. The test set was examined during earlier model development, so they should not be interpreted as independent validation results.

## Explainable AI

SHAP is used to explain model predictions.

The application provides:
- Individual feature contributions.
- Baseline and model output log-odds.
- Global grouped feature importance.

SHAP contributions describe model behavior. They do not establish causation or clinical importance.

## Project Structure

```text
Dummy/
├── app/
│   ├── ml/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── data/
│   └── raw/
├── frontend/
│   └── src/
│       └── components/
├── models/
├── notebooks/
├── reports/
│   └── figures/
├── tests/
├── requirements.txt
├── README.md
└── .gitignore
```

## Running Locally

### Backend

Create and activate a Python virtual environment.

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Testing

Run the backend tests:

```bash
python -m pytest tests/ -v
```

## Limitations

- The dataset contains only 303 historical records.
- The original test set was examined during development.
- No independent external validation has been performed.
- No clinical validation has been performed.
- Model probabilities are not clinically calibrated disease-risk estimates.

## Future Improvements

- External model validation using independent datasets.
- Improved model calibration and threshold selection.
- Additional classification algorithms.
- More robust automated testing.
- Secure deployment and monitoring.
- Improved explainability and model reporting.

## Disclaimer

CardioAI is developed strictly for educational and research purposes. It is not intended to diagnose, treat, prevent or predict disease for individual patients.

## Author

Developed as an academic Artificial Intelligence and Machine Learning project.