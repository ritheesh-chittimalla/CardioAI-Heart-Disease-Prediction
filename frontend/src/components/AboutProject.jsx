
import {
    HeartPulse,
    Database,
    BrainCircuit,
    Workflow,
    Code,
    ShieldAlert,
    CheckCircle2,
} from "lucide-react";

import "./AboutProject.css";

function AboutProject() {
    const technologies = [
        { name: "Python", category: "Programming Language" },
        { name: "Pandas & NumPy", category: "Data Processing" },
        { name: "Scikit-learn", category: "Machine Learning" },
        { name: "SHAP", category: "Explainable AI" },
        { name: "FastAPI", category: "Backend API" },
        { name: "React", category: "Frontend" },
        { name: "Recharts", category: "Data Visualization" },
    ];

    const workflow = [
        "Dataset collection",
        "Data cleaning and preprocessing",
        "Feature transformation",
        "Model training",
        "Model evaluation",
        "Prediction and SHAP explanation",
    ];

    return (
        <div className="about-page">

            <section className="about-hero">
                <div className="about-hero-icon">
                    <HeartPulse size={32} />
                </div>

                <div>
                    <span className="about-eyebrow">PROJECT OVERVIEW</span>
                    <h2>About CardioAI</h2>
                    <p>
                        An experimental machine learning application for
                        heart disease classification and model explainability.
                    </p>
                </div>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <BrainCircuit size={21} />
                    <h3>Project Objective</h3>
                </div>

                <p>
                    CardioAI is an educational machine learning project that
                    explores how classification algorithms can identify
                    patterns associated with heart disease in a historical
                    dataset.
                </p>

                <p>
                    The application accepts 13 patient-related input features,
                    generates a binary model classification, displays an
                    estimated class probability and provides SHAP-based
                    explanations of the model output.
                </p>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <Database size={21} />
                    <h3>Dataset Information</h3>
                </div>

                <div className="about-stats">
                    <div>
                        <strong>303</strong>
                        <span>Total records</span>
                    </div>

                    <div>
                        <strong>13</strong>
                        <span>Input features</span>
                    </div>

                    <div>
                        <strong>2</strong>
                        <span>Target classes</span>
                    </div>
                </div>

                <p>
                    The project uses the Cleveland subset of the UCI Heart
                    Disease dataset. The original target variable is converted
                    into a binary classification target: 0 represents the
                    negative class and 1 represents the positive class.
                </p>

                <p>
                    Missing values in the dataset are handled through
                    preprocessing pipelines using median imputation for
                    numerical features and most-frequent imputation for
                    categorical features.
                </p>

                <a
                    className="about-external-link"
                    href="https://archive.ics.uci.edu/dataset/45/heart+disease"
                    target="_blank"
                    rel="noreferrer"
                >
                    View UCI Heart Disease Dataset
                </a>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <Workflow size={21} />
                    <h3>Machine Learning Workflow</h3>
                </div>

                <div className="workflow-list">
                    {workflow.map((step, index) => (
                        <div className="workflow-item" key={step}>
                            <div className="workflow-number">
                                {index + 1}
                            </div>

                            <div>
                                <strong>{step}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <Code size={21} />
                    <h3>Technology Stack</h3>
                </div>

                <div className="technology-grid">
                    {technologies.map((technology) => (
                        <div className="technology-card" key={technology.name}>
                            <CheckCircle2 size={17} />
                            <div>
                                <strong>{technology.name}</strong>
                                <span>{technology.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <BrainCircuit size={21} />
                    <h3>Machine Learning Models</h3>
                </div>

                <div className="model-description">
                    <h4>Logistic Regression</h4>
                    <p>
                        Selected as the primary prediction model. It estimates
                        class probabilities and uses a provisional classification
                        threshold of 0.40.
                    </p>
                </div>

                <div className="model-description">
                    <h4>Random Forest</h4>
                    <p>
                        Used as a comparison model to evaluate the performance
                        of an ensemble of decision trees.
                    </p>
                </div>
            </section>


            <section className="about-section">
                <div className="about-section-heading">
                    <BrainCircuit size={21} />
                    <h3>Explainable AI</h3>
                </div>

                <p>
                    SHAP (SHapley Additive exPlanations) is used to explain
                    individual predictions and summarize feature contributions
                    across the evaluation dataset.
                </p>

                <p>
                    Individual explanations show how transformed features
                    contribute to the model output. Global importance groups
                    those contributions by original input feature.
                </p>
            </section>


            <section className="about-limitations">
                <div className="about-section-heading">
                    <ShieldAlert size={21} />
                    <h3>Limitations and Responsible Use</h3>
                </div>

                <ul>
                    <li>
                        The dataset contains only 303 historical records.
                    </li>

                    <li>
                        Evaluation results are preliminary because the test
                        set was examined during model development.
                    </li>

                    <li>
                        The model has not undergone independent external
                        or clinical validation.
                    </li>

                    <li>
                        Estimated probabilities are model outputs, not
                        clinically validated disease risks.
                    </li>

                    <li>
                        This application must not be used for diagnosis
                        or medical decision-making.
                    </li>
                </ul>
            </section>

            <div className="about-footer">
                CardioAI · Educational and Research Project
            </div>

        </div>
    );
}

export default AboutProject;
