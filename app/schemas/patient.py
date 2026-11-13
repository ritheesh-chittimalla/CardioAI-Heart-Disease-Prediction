
from typing import Literal

from pydantic import BaseModel, Field


class PatientInput(BaseModel):

    age: int = Field(ge=1, le=120, description="Age in years")

    sex: Literal[0, 1] = Field(
        description="0 = Female, 1 = Male"
    )

    cp: Literal[1, 2, 3, 4] = Field(
        description="Chest pain type"
    )

    trestbps: int = Field(
        ge=50, le=300,
        description="Resting blood pressure in mm Hg"
    )

    chol: int = Field(
        ge=50, le=700,
        description="Serum cholesterol in mg/dl"
    )

    fbs: Literal[0, 1] = Field(
        description="Fasting blood sugar above 120 mg/dl: 1 = Yes, 0 = No"
    )

    restecg: Literal[0, 1, 2] = Field(
        description="Resting ECG result"
    )

    thalach: int = Field(
        ge=40, le=250,
        description="Maximum heart rate achieved"
    )

    exang: Literal[0, 1] = Field(
        description="Exercise-induced angina: 1 = Yes, 0 = No"
    )

    oldpeak: float = Field(
        ge=0, le=10,
        description="ST depression induced by exercise relative to rest"
    )

    slope: Literal[1, 2, 3] = Field(
        description="Slope of the peak exercise ST segment"
    )

    ca: Literal[0, 1, 2, 3] = Field(
        description="Number of major vessels colored by fluoroscopy"
    )

    thal: Literal[3, 6, 7] = Field(
        description="Thalassemia category: 3 = Normal, 6 = Fixed defect, 7 = Reversible defect"
    )
