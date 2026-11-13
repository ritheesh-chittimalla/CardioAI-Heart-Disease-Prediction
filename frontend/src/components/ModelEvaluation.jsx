
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Activity,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    ChartColumn,
    Info,
    Target,
    Crosshair,
    Gauge,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

import "./ModelEvaluation.css";

const API_URL = "http://127.0.0.1:8000";

const metricLabels = [
    { key: "accuracy", label: "Accuracy" },
    { key: "precision", label: "Precision" },
    { key: "recall", label: "Recall" },
    { key: "f1_score", label: "F1 Score" },
    { key: "roc_auc", label: "ROC-AUC" },
];

function formatPercent(value) {
    return `${(value * 100).toFixed(2)}%`;
}


function ConfusionMatrix({ model }) {
    const matrix = model.confusion_matrix.matrix;

    return (
        <div className="confusion-matrix">
            <div className="matrix-grid">
                <div className="matrix-column-label">Actual / Predicted</div>
                <div className="matrix-column-label">Negative</div>
                <div className="matrix-column-label">Positive</div>

                <div className="matrix-row-label">Actual Negative</div>
                <div className="matrix-cell matrix-correct">
                    <strong>{matrix[0][0]}</strong>
                    <span>True Negative</span>
                </div>
                <div className="matrix-cell matrix-incorrect">
                    <strong>{matrix[0][1]}</strong>
                    <span>False Positive</span>
                </div>

                <div className="matrix-row-label">Actual Positive</div>
                <div className="matrix-cell matrix-incorrect">
                    <strong>{matrix[1][0]}</strong>
                    <span>False Negative</span>
                </div>
                <div className="matrix-cell matrix-correct">
                    <strong>{matrix[1][1]}</strong>
                    <span>True Positive</span>
                </div>
            </div>
        </div>
    );
}


function ModelEvaluation() {
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvaluation = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${API_URL}/model/evaluation`
            );

            setEvaluation(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load evaluation results. Check whether FastAPI is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluation();
    }, []);

    if (loading) {
        return (
            <div className="evaluation-state">
                <LoaderCircle className="loading-icon" size={28} />
                <p>Loading model evaluation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="evaluation-state evaluation-error">
                <AlertCircle size={25} />
                <p>{error}</p>
                <button onClick={fetchEvaluation}>
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    if (!evaluation || evaluation.models.length < 2) {
        return (
            <div className="evaluation-state">
                Evaluation data is incomplete.
            </div>
        );
    }

    const logistic = evaluation.models[0];
    const forest = evaluation.models[1];

    const comparisonData = metricLabels.map((metric) => ({
        metric: metric.label,
        logistic: logistic.metrics[metric.key] * 100,
        randomForest: forest.metrics[metric.key] * 100,
    }));

    const rocData = logistic.roc_curve.map((point) => ({
        fpr: point.false_positive_rate,
        logistic: point.true_positive_rate,
    }));

    forest.roc_curve.forEach((point) => {
        const existing = rocData.find(
            (item) => item.fpr === point.false_positive_rate
        );

        if (existing) {
            existing.randomForest = point.true_positive_rate;
        } else {
            rocData.push({
                fpr: point.false_positive_rate,
                randomForest: point.true_positive_rate,
            });
        }
    });

    rocData.sort((a, b) => a.fpr - b.fpr);

    const topMetric = logistic.metrics.accuracy;

    return (
        <div className="evaluation-page">

            <div className="evaluation-intro">
                <div>
                    <div className="evaluation-label">
                        <ChartColumn size={15} />
                        MODEL PERFORMANCE ANALYTICS
                    </div>

                    <h2>Model Evaluation</h2>

                    <p>
                        Compare the performance of Logistic Regression and
                        Random Forest on the same test dataset.
                    </p>
                </div>

                <button
                    className="evaluation-refresh"
                    onClick={fetchEvaluation}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>


            <div className="evaluation-warning">
                <Info size={19} />
                <div>
                    <strong>{evaluation.evaluation_type}</strong>
                    <p>{evaluation.evaluation_note}</p>
                </div>
            </div>


            <section className="evaluation-summary-grid">

                <div className="evaluation-summary-card">
                    <div className="evaluation-summary-icon">
                        <Target size={21} />
                    </div>
                    <span>Test Records</span>
                    <strong>{evaluation.test_records}</strong>
                    <small>From {evaluation.total_dataset_records} total records</small>
                </div>

                <div className="evaluation-summary-card">
                    <div className="evaluation-summary-icon">
                        <Gauge size={21} />
                    </div>
                    <span>Logistic Regression Accuracy</span>
                    <strong>{formatPercent(topMetric)}</strong>
                    <small>Threshold: {logistic.classification_threshold}</small>
                </div>

                <div className="evaluation-summary-card">
                    <div className="evaluation-summary-icon">
                        <Activity size={21} />
                    </div>
                    <span>Logistic Regression ROC-AUC</span>
                    <strong>{formatPercent(logistic.metrics.roc_auc)}</strong>
                    <small>Threshold independent metric</small>
                </div>

            </section>


            <section className="evaluation-panel">

                <div className="evaluation-panel-heading">
                    <div>
                        <h3>Model Performance Comparison</h3>
                        <p>Comparison of five classification metrics.</p>
                    </div>
                </div>

                <div className="evaluation-chart">
                    <ResponsiveContainer width="100%" height={340}>
                        <BarChart
                            data={comparisonData}
                            margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e9edf4"
                            />

                            <XAxis
                                dataKey="metric"
                                tick={{ fontSize: 11, fill: "#75849b" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                                tick={{ fontSize: 10, fill: "#8290a4" }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                formatter={(value) => `${Number(value).toFixed(2)}%`}
                            />

                            <Legend />

                            <Bar
                                dataKey="logistic"
                                name="Logistic Regression"
                                fill="#3978e8"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="randomForest"
                                name="Random Forest"
                                fill="#8b6bd6"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </section>


            <section className="evaluation-panel">

                <div className="evaluation-panel-heading">
                    <div>
                        <h3>ROC Curve Comparison</h3>
                        <p>
                            True positive rate against false positive rate.
                        </p>
                    </div>
                </div>

                <div className="evaluation-chart">
                    <ResponsiveContainer width="100%" height={340}>
                        <LineChart
                            data={rocData}
                            margin={{ top: 10, right: 20, left: 5, bottom: 10 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e9edf4"
                            />

                            <XAxis
                                type="number"
                                dataKey="fpr"
                                domain={[0, 1]}
                                tick={{ fontSize: 10, fill: "#8290a4" }}
                                label={{
                                    value: "False Positive Rate",
                                    position: "insideBottom",
                                    offset: -5,
                                    fontSize: 11,
                                }}
                            />

                            <YAxis
                                type="number"
                                domain={[0, 1]}
                                tick={{ fontSize: 10, fill: "#8290a4" }}
                                label={{
                                    value: "True Positive Rate",
                                    angle: -90,
                                    position: "insideLeft",
                                    fontSize: 11,
                                }}
                            />

                            <Tooltip
                                formatter={(value) => Number(value).toFixed(4)}
                            />

                            <Legend />

                            <Line
                                type="linear"
                                dataKey="logistic"
                                name={`Logistic Regression (AUC ${logistic.metrics.roc_auc})`}
                                stroke="#3978e8"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls
                            />

                            <Line
                                type="linear"
                                dataKey="randomForest"
                                name={`Random Forest (AUC ${forest.metrics.roc_auc})`}
                                stroke="#8b6bd6"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </section>


            <section className="evaluation-matrices">

                <div className="evaluation-panel">
                    <div className="evaluation-panel-heading">
                        <div>
                            <h3>Logistic Regression</h3>
                            <p>Threshold: {logistic.classification_threshold}</p>
                        </div>
                    </div>

                    <ConfusionMatrix model={logistic} />
                </div>


                <div className="evaluation-panel">
                    <div className="evaluation-panel-heading">
                        <div>
                            <h3>Random Forest</h3>
                            <p>Threshold: {forest.classification_threshold}</p>
                        </div>
                    </div>

                    <ConfusionMatrix model={forest} />
                </div>

            </section>


            <section className="evaluation-panel">

                <div className="evaluation-panel-heading">
                    <div>
                        <h3>Detailed Metric Comparison</h3>
                        <p>Numerical performance of both models.</p>
                    </div>
                </div>

                <div className="evaluation-table-wrapper">
                    <table className="evaluation-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Logistic Regression</th>
                                <th>Random Forest</th>
                            </tr>
                        </thead>

                        <tbody>
                            {metricLabels.map((metric) => (
                                <tr key={metric.key}>
                                    <td>{metric.label}</td>
                                    <td>
                                        {formatPercent(logistic.metrics[metric.key])}
                                    </td>
                                    <td>
                                        {formatPercent(forest.metrics[metric.key])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </section>


            <div className="evaluation-disclaimer">
                <Info size={18} />
                <p>
                    These metrics describe performance on a small historical
                    dataset. The test set was previously examined during model
                    development, so results are preliminary and not independent
                    external validation. This application is not intended for
                    medical diagnosis or clinical decisions.
                </p>
            </div>

        </div>
    );
}

export default ModelEvaluation;
