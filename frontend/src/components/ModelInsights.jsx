
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Activity,
    BrainCircuit,
    ChartColumn,
    RefreshCw,
    AlertCircle,
    LoaderCircle,
    Info,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import "./ModelInsights.css";

const API_URL = "http://127.0.0.1:8000";

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

    return featureLabels[cleanName] || cleanName;
}

function ModelInsights() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInsights = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${API_URL}/model/feature-importance`
            );

            const features = response.data.features.map((item) => ({
                ...item,
                feature: formatFeatureName(item.feature),
            }));

            setData({
                ...response.data,
                features,
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load model feature importance. Check whether the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    if (loading) {
        return (
            <div className="insights-state">
                <LoaderCircle className="loading-icon" size={28} />
                <p>Loading model insights...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="insights-error">
                <AlertCircle size={22} />
                <p>{error}</p>
                <button onClick={fetchInsights}>
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    const features = data?.features || [];
    const topFeature = features[0];

    return (
        <div className="insights-page">

            <div className="insights-intro">
                <div>
                    <div className="insights-label">
                        <BrainCircuit size={15} />
                        MODEL ANALYTICS
                    </div>

                    <h2>Global Feature Importance</h2>

                    <p>
                        Understand which original patient features contribute
                        most to the model's output across the evaluated records.
                    </p>
                </div>

                <button
                    className="insights-refresh"
                    onClick={fetchInsights}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>


            <section className="insights-stats">

                <div className="insight-stat-card">
                    <div className="insight-stat-icon blue-icon">
                        <Activity size={21} />
                    </div>

                    <span>Model Algorithm</span>
                    <strong>{data.model_name}</strong>
                </div>

                <div className="insight-stat-card">
                    <div className="insight-stat-icon purple-icon">
                        <ChartColumn size={21} />
                    </div>

                    <span>Features Analyzed</span>
                    <strong>{features.length}</strong>
                </div>

                <div className="insight-stat-card">
                    <div className="insight-stat-icon green-icon">
                        <BrainCircuit size={21} />
                    </div>

                    <span>Model Version</span>
                    <strong>{data.model_version}</strong>
                </div>

            </section>


            {topFeature && (
                <section className="top-feature-card">

                    <div className="top-feature-icon">
                        <ChartColumn size={23} />
                    </div>

                    <div>
                        <span>HIGHEST GLOBAL FEATURE IMPORTANCE</span>
                        <h3>{topFeature.feature}</h3>
                        <p>
                            Mean absolute grouped SHAP value:{" "}
                            <strong>{topFeature.importance.toFixed(4)}</strong>
                        </p>
                    </div>

                </section>
            )}


            <section className="insights-chart-panel">

                <div className="insights-panel-heading">
                    <div>
                        <h3>Feature Importance Ranking</h3>
                        <p>
                            Features ranked by mean absolute grouped SHAP value.
                        </p>
                    </div>

                    <span className="chart-tag">SHAP Analysis</span>
                </div>


                <div className="importance-chart">
                    <ResponsiveContainer width="100%" height={430}>
                        <BarChart
                            data={features}
                            layout="vertical"
                            margin={{
                                top: 10,
                                right: 30,
                                left: 15,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#e9edf4"
                            />

                            <XAxis
                                type="number"
                                tick={{ fill: "#8290a4", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="feature"
                                width={155}
                                tick={{ fill: "#536176", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{ fill: "#f4f7fc" }}
                                formatter={(value) => [
                                    Number(value).toFixed(4),
                                    "Mean absolute SHAP",
                                ]}
                            />

                            <Bar
                                dataKey="importance"
                                fill="#3978e8"
                                radius={[0, 5, 5, 0]}
                                barSize={19}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                <div className="chart-explanation">
                    <Info size={18} />

                    <p>
                        Higher values indicate larger average absolute grouped
                        SHAP contributions to the model output across the
                        evaluated records. They do not indicate whether a feature
                        increases or decreases class 1 output, and do not establish
                        causation or clinical importance.
                    </p>
                </div>

            </section>


            <section className="insights-table-panel">

                <div className="insights-panel-heading">
                    <div>
                        <h3>Feature Importance Details</h3>
                        <p>Numerical ranking of original patient features.</p>
                    </div>
                </div>


                <div className="importance-table-wrapper">
                    <table className="importance-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Patient Feature</th>
                                <th>Mean Absolute SHAP</th>
                            </tr>
                        </thead>

                        <tbody>
                            {features.map((item, index) => (
                                <tr key={item.feature}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <strong>{item.feature}</strong>
                                    </td>

                                    <td className="importance-number">
                                        {item.importance.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </section>


            <div className="insights-disclaimer">
                <Info size={18} />

                <p>
                    Global feature importance describes model behavior on
                    the evaluated dataset. It is not a measure of causation,
                    individual patient risk, or clinical significance.
                </p>
            </div>

        </div>
    );
}

export default ModelInsights;
