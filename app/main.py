
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.patient import PatientInput
from app.services.prediction_service import predict_heart_disease
from app.services.explanation_service import explain_prediction
from app.services.feature_importance_service import get_feature_importance
from app.services.evaluation_service import get_model_evaluation

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)

logger = logging.getLogger(__name__)


app = FastAPI(
    title="Heart Disease Prediction API",
    description="Experimental heart disease classification and explainability API",
    version="1.2.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
):
    logger.exception(
        "Unexpected error while processing %s",
        request.url.path
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred."
        }
    )


@app.get("/")
def home():
    return {
        "message": "Welcome to Heart Disease Prediction API",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "heart-disease-prediction"
    }


@app.post("/predict")
def predict(patient: PatientInput):
    logger.info("Received prediction request")

    patient_data = patient.model_dump()
    result = predict_heart_disease(patient_data)

    logger.info("Prediction request completed")

    return result


@app.post("/explain")
def explain(patient: PatientInput):
    logger.info("Received explanation request")

    patient_data = patient.model_dump()
    result = explain_prediction(patient_data)

    logger.info("Explanation request completed")

    return result


@app.get("/model/feature-importance")
def feature_importance():
    logger.info("Received feature importance request")

    result = get_feature_importance()

    logger.info("Feature importance request completed")

    return result

@app.get("/model/evaluation")
def model_evaluation():
    return get_model_evaluation()