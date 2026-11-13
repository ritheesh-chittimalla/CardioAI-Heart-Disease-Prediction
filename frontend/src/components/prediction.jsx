
import { useState } from "react";
import axios from "axios";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    LoaderCircle,
    RotateCcw,
    ClipboardPlus,
    BrainCircuit,
    TrendingUp,
    TrendingDown,
    Info,
} from "lucide-react";

import "./Prediction.css";

const API_URL = "http://127.0.0.1:8000";

const initialForm = {
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
};

const fields = [
    {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "Enter age",
        description: "Age in years",
    },
    {
        name: "sex",
        label: "Sex",
        type: "select",
        options: [
            { value: "1", label: "Male" },
            { value: "0", label: "Female" },
        ],
    },
    {
        name: "cp",
        label: "Chest Pain Type",
        type: "select",
        options: [
            { value: "1", label: "Typical angina" },
            { value: "2", label: "Atypical angina" },
            { value: "3", label: "Non-anginal pain" },
            { value: "4", label: "Asymptomatic" },
        ],
    },
    {
        name: "trestbps",
        label: "Resting Blood Pressure",
        type: "number",
        placeholder: "e.g. 120",
        description: "mm Hg",
    },
    {
        name: "chol",
        label: "Serum Cholesterol",
        type: "number",
        placeholder: "e.g. 200",
        description: "mg/dl",
    },
    {
        name: "fbs",
        label: "Fasting Blood Sugar",
        type: "select",
        options: [
            { value: "1", label: "Greater than 120 mg/dl" },
            { value: "0", label: "Less than or equal to 120 mg/dl" },
        ],
    },
    {
        name: "restecg",
        label: "Resting ECG",
        type: "select",
        options: [
            { value: "0", label: "Normal" },
            { value: "1", label: "ST-T wave abnormality" },
            { value: "2", label: "Left ventricular hypertrophy" },
        ],
    },
    {
        name: "thalach",
        label: "Maximum Heart Rate",
        type: "number",
        placeholder: "e.g. 150",
        description: "Maximum heart rate achieved",
    },
    {
        name: "exang",
        label: "Exercise Induced Angina",
        type: "select",
        options: [
            { value: "1", label: "Yes" },
            { value: "0", label: "No" },
        ],
    },
    {
        name: "oldpeak",
        label: "Oldpeak",
        type: "number",
        placeholder: "e.g. 1.0",
        description: "ST depression induced by exercise relative to rest",
        step: "0.1",
    },
    {
        name: "slope",
        label: "ST Segment Slope",
        type: "select",
        options: [
            { value: "1", label: "Upsloping" },
            { value: "2", label: "Flat" },
            { value: "3", label: "Downsloping" },
        ],
    },
    {
        name: "ca",
        label: "Major Vessels (ca)",
        type: "select",
        options: [
            { value: "0", label: "0 vessels" },
            { value: "1", label: "1 vessel" },
            { value: "2", label: "2 vessels" },
            { value: "3", label: "3 vessels" },
        ],
    },
    {
        name: "thal",
        label: "Thalassemia (thal)",
        type: "select",
        options: [
            { value: "3", label: "Normal" },
            { value: "6", label: "Fixed defect" },
            { value: "7", label: "Reversible defect" },
        ],
    },
];

const featureLabels = {
    age: "Age",
    sex: "Sex",
    cp: "Chest Pain Type",
    trestbps: "Resting Blood Pressure",
    chol: "Serum Cholesterol",
    fbs: "Fasting Blood Sugar",
    restecg: "Resting ECG",
    thalach: "Maximum Heart Rate",
    exang: "Exercise Induced Angina",
    oldpeak: "Oldpeak",
    slope: "ST Segment Slope",
    ca: "Major Vessels",
    thal: "Thalassemia",
};

function formatFeatureName(name) {
    const cleanName = name.replace(/^(categorical|numerical)__/, "");

    const match = cleanName.match(/^([a-zA-Z]+)_(.+)$/);

    if (match) {
        const feature = featureLabels[match[1]] || match[1];
        return `${feature} (${match[2]})`;
    }

    return featureLabels[cleanName] || cleanName;
}

function Prediction() {
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setResult(null);
        setExplanation(null);

        try {
            const patientData = {
                age: Number(form.age),
                sex: Number(form.sex),
                cp: Number(form.cp),
                trestbps: Number(form.trestbps),
                chol: Number(form.chol),
                fbs: Number(form.fbs),
                restecg: Number(form.restecg),
                thalach: Number(form.thalach),
                exang: Number(form.exang),
                oldpeak: Number(form.oldpeak),
                slope: Number(form.slope),
                ca: Number(form.ca),
                thal: Number(form.thal),
            };

            const [predictionResponse, explanationResponse] =
                await Promise.all([
                    axios.post(`${API_URL}/predict`, patientData),
                    axios.post(`${API_URL}/explain`, patientData),
                ]);

            setResult(predictionResponse.data);
            setExplanation(explanationResponse.data);
        } catch (err) {
            if (err.response?.status === 422) {
                setError(
                    "Some patient information is invalid. Please check your entries."
                );
            } else if (err.response) {
                setError(
                    err.response.data?.message ||
                    "The prediction or explanation request failed."
                );
            } else {
                setError(
                    "Cannot connect to the backend. Check whether FastAPI is running."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(initialForm);
        setResult(null);
        setExplanation(null);
        setError("");
    };

    const renderField = (field) => (
        <div className="patient-field" key={field.name}>
            <label htmlFor={field.name}>
                {field.label}
                <span className="required-mark">*</span>
            </label>

            {field.type === "select" ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select {field.label}</option>

                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    step={field.step || "1"}
                    required
                />
            )}

            {field.description && (
                <small>{field.description}</small>
            )}
        </div>
    );

    return (
        <div className="prediction-page">

            <div className="prediction-intro">
                <div>
                    <div className="prediction-label">
                        <Activity size={15} />
                        PATIENT ASSESSMENT
                    </div>

                    <h2>Heart Disease Prediction</h2>

                    <p>
                        Enter the 13 patient features used by the trained
                        machine learning model.
                    </p>
                </div>
            </div>


            <form onSubmit={handleSubmit}>
                <section className="prediction-form-panel">

                    <div className="form-section-heading">
                        <div className="form-heading-icon">
                            <ClipboardPlus size={21} />
                        </div>

                        <div>
                            <h3>Patient Information</h3>
                            <p>All fields are required.</p>
                        </div>
                    </div>

                    <div className="patient-form-grid">
                        {fields.map(renderField)}
                    </div>

                    {error && (
                        <div className="prediction-error">
                            <AlertCircle size={19} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="reset-button"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            <RotateCcw size={17} />
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            className="submit-prediction-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={18} className="loading-icon" />
                                    Generating Results...
                                </>
                            ) : (
                                <>
                                    <Activity size={18} />
                                    Generate Prediction
                                </>
                            )}
                        </button>

                    </div>
                </section>
            </form>


            {result && (
                <section className="prediction-result-panel">

                    <div className="result-heading">
                        <div>
                            <span className="result-label">MODEL OUTPUT</span>
                            <h3>Prediction Results</h3>
                        </div>

                        <CheckCircle2 size={25} color="#15945b" />
                    </div>

                    <div
                        className={`result-status ${result.prediction === 1
                                ? "result-positive"
                                : "result-negative"
                            }`}
                    >
                        <span className="result-status-label">
                            Model classification
                        </span>

                        <h2>
                            {result.prediction === 1
                                ? "Positive Classification"
                                : "Negative Classification"}
                        </h2>

                        <p>{result.result}</p>
                    </div>

                    <div className="probability-section">

                        <div className="probability-heading">
                            <span>Estimated probability of class 1</span>

                            <strong>
                                {(result.estimated_probability * 100).toFixed(2)}%
                            </strong>
                        </div>

                        <div className="probability-track">
                            <div
                                className="probability-fill"
                                style={{
                                    width: `${result.estimated_probability * 100}%`,
                                }}
                            />
                        </div>

                        <div className="probability-details">
                            <span>
                                Threshold: {result.classification_threshold}
                            </span>

                            <span>
                                {result.model_name} · v{result.model_version}
                            </span>
                        </div>

                    </div>

                    <div className="result-disclaimer">
                        This is an experimental machine learning classification,
                        not a medical diagnosis or validated clinical risk estimate.
                        Do not use it to make medical decisions.
                    </div>

                </section>
            )}


            {explanation && (
                <section className="explanation-panel">

                    <div className="explanation-heading">
                        <div className="explanation-title-icon">
                            <BrainCircuit size={23} />
                        </div>

                        <div>
                            <span className="result-label">MODEL EXPLAINABILITY</span>
                            <h3>Why did the model make this prediction?</h3>
                            <p>
                                SHAP-based feature contributions for this input.
                            </p>
                        </div>
                    </div>


                    <div className="shap-summary-grid">

                        <div className="shap-summary-card">
                            <span>Baseline Log-Odds</span>
                            <strong>
                                {explanation.explanation.baseline_log_odds}
                            </strong>
                        </div>

                        <div className="shap-summary-card">
                            <span>Model Output Log-Odds</span>
                            <strong>
                                {explanation.explanation.model_output_log_odds}
                            </strong>
                        </div>

                    </div>


                    <div className="shap-section-heading">
                        <div>
                            <h4>Top Feature Contributions</h4>
                            <p>
                                Contributions to the model output for class 1.
                            </p>
                        </div>
                    </div>


                    <div className="shap-legend">
                        <span>
                            <i className="legend-positive" />
                            Increases class 1 output
                        </span>

                        <span>
                            <i className="legend-negative" />
                            Decreases class 1 output
                        </span>
                    </div>


                    <div className="shap-list">

                        {explanation.explanation.top_feature_contributions.map(
                            (item, index) => {
                                const positive =
                                    item.direction === "increases_class_1_output";

                                const barWidth =
                                    (Math.abs(item.shap_value) /
                                        Math.max(
                                            ...explanation.explanation.top_feature_contributions.map(
                                                (feature) => Math.abs(feature.shap_value)
                                            ),
                                            0.0001
                                        )) *
                                    100;

                                return (
                                    <div className="shap-item" key={`${item.feature}-${index}`}>

                                        <div className="shap-item-top">
                                            <div className="shap-feature-name">
                                                <span className="shap-rank">
                                                    {index + 1}
                                                </span>

                                                <span>
                                                    {formatFeatureName(item.feature)}
                                                </span>
                                            </div>

                                            <strong
                                                className={
                                                    positive
                                                        ? "shap-positive-value"
                                                        : "shap-negative-value"
                                                }
                                            >
                                                {item.shap_value > 0 ? "+" : ""}
                                                {item.shap_value.toFixed(4)}
                                            </strong>
                                        </div>

                                        <div className="shap-bar-track">
                                            <div
                                                className={`shap-bar ${positive
                                                        ? "shap-bar-positive"
                                                        : "shap-bar-negative"
                                                    }`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>

                                        <div className="shap-item-description">
                                            {positive ? (
                                                <TrendingUp size={14} />
                                            ) : (
                                                <TrendingDown size={14} />
                                            )}

                                            <span>
                                                {positive
                                                    ? "Increases"
                                                    : "Decreases"}{" "}
                                                class 1 model output
                                            </span>

                                            <span className="shap-feature-value">
                                                Encoded value: {item.feature_value}
                                            </span>
                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    <div className="shap-disclaimer">
                        <Info size={17} />

                        <p>
                            SHAP values explain how encoded features contribute to
                            this model's output in log-odds. They do not establish
                            causation or clinical importance. One-hot encoded
                            categories are shown separately.
                        </p>
                    </div>

                </section>
            )}

        </div>
    );
}

export default Prediction;
