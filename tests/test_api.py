
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

VALID_PATIENT = {
    "age": 45,
    "sex": 1,
    "cp": 4,
    "trestbps": 130,
    "chol": 250,
    "fbs": 0,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 1.0,
    "slope": 2,
    "ca": 0,
    "thal": 3
}


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Running"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_prediction_endpoint():
    response = client.post("/predict", json=VALID_PATIENT)

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] in [0, 1]
    assert 0 <= data["estimated_probability"] <= 1
    assert data["classification_threshold"] == 0.4


def test_explanation_endpoint():
    response = client.post("/explain", json=VALID_PATIENT)

    assert response.status_code == 200

    data = response.json()

    assert "explanation" in data
    assert "top_feature_contributions" in data["explanation"]
    assert len(data["explanation"]["top_feature_contributions"]) > 0


def test_feature_importance_endpoint():
    response = client.get("/model/feature-importance")

    assert response.status_code == 200

    data = response.json()

    assert "features" in data
    assert len(data["features"]) > 0

    importances = [
        item["importance"] for item in data["features"]
    ]

    assert importances == sorted(importances, reverse=True)


def test_invalid_patient_input():
    invalid_patient = VALID_PATIENT.copy()
    invalid_patient["sex"] = 5

    response = client.post("/predict", json=invalid_patient)

    assert response.status_code == 422


def test_missing_patient_field():
    invalid_patient = VALID_PATIENT.copy()
    del invalid_patient["age"]

    response = client.post("/predict", json=invalid_patient)

    assert response.status_code == 422


def test_prediction_and_explanation_consistency():
    prediction_response = client.post(
        "/predict",
        json=VALID_PATIENT
    )

    explanation_response = client.post(
        "/explain",
        json=VALID_PATIENT
    )

    assert prediction_response.status_code == 200
    assert explanation_response.status_code == 200

    prediction_data = prediction_response.json()
    explanation_data = explanation_response.json()

    assert (
        prediction_data["prediction"]
        == explanation_data["prediction"]
    )

    assert abs(
        prediction_data["estimated_probability"]
        - explanation_data["estimated_probability"]
    ) < 0.0001
