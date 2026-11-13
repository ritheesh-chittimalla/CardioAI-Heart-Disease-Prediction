
import { useState } from "react";

import {
  Activity,
  LayoutDashboard,
  ClipboardPlus,
  ChartColumn,
  Info,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  HeartPulse,
  Users,
  ShieldCheck,
  Clock3,
  Menu,
  X,
  Plus,
} from "lucide-react";

import Prediction from "./components/prediction.jsx";
import ModelInsights from "./components/ModelInsights.jsx";
import ModelEvaluation from "./components/ModelEvaluation";
import AboutProject from "./components/AboutProject";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "New Prediction", icon: ClipboardPlus },
    { title: "Model Insights", icon: ChartColumn },
    { title: "Model Evaluation", icon: Activity },
    { title: "About Project", icon: Info },
  ];

  const pageDescriptions = {
    Dashboard: "Overview of your heart disease prediction system.",
    "New Prediction": "Enter patient information to generate a model prediction.",
    "Model Insights": "Explore model feature importance and behavior.",
    "Model Evaluation": "Compare model performance and classification results.",
    "About Project": "Learn about the project, dataset and model limitations.",
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <HeartPulse size={25} />
          </div>

          <div className="brand-text">
            <h2>CardioAI</h2>
            <span>Prediction System</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">MAIN MENU</p>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  className={`nav-item ${activePage === item.title ? "nav-item-active" : ""
                    }`}
                  onClick={() => handleNavigation(item.title)}
                >
                  <Icon size={19} />
                  <span>{item.title}</span>

                  {activePage === item.title && (
                    <span className="active-indicator" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-help">
            <div className="help-icon">
              <ShieldCheck size={21} />
            </div>

            <h4>Experimental ML System</h4>

            <p>
              For educational and research purposes.
              Not intended for medical diagnosis.
            </p>
          </div>

          <button className="nav-item settings-button">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-footer">
            <div className="profile-avatar">AI</div>

            <div className="profile-details">
              <strong>Administrator</strong>
              <span>Project Workspace</span>
            </div>

            <ChevronDown size={17} className="profile-chevron" />
          </div>

        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="breadcrumb">
                Workspace <span>/</span> {activePage}
              </div>

              <h1>{activePage}</h1>
            </div>

          </div>

          <div className="topbar-right">

            <div className="system-status">
              <span className="status-dot" />
              API Connected
            </div>

            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>

            <button
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            <div className="topbar-profile">
              <div className="profile-avatar top-avatar">AI</div>
              <ChevronDown size={16} />
            </div>

          </div>
        </header>

        <div className="page-content">

          <div className="welcome-section">

            <div>
              <p className="welcome-label">
                CARDIOVASCULAR ANALYTICS
              </p>

              <h2>Welcome to CardioAI</h2>

              <p className="welcome-description">
                {pageDescriptions[activePage]}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => handleNavigation("New Prediction")}
            >
              <Plus size={18} />
              New Prediction
            </button>

          </div>

          {activePage === "Dashboard" && (
            <>

              <section className="stats-grid">

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon blue-icon">
                      <Activity size={21} />
                    </div>
                    <span className="stat-tag">Model</span>
                  </div>

                  <p className="stat-label">Current Model</p>
                  <h3>Logistic Regression</h3>
                  <p className="stat-description">Version 1.0</p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon purple-icon">
                      <ChartColumn size={21} />
                    </div>
                    <span className="stat-tag">Evaluation</span>
                  </div>

                  <p className="stat-label">Test Accuracy</p>
                  <h3>88.52%</h3>
                  <p className="stat-description">
                    Preliminary evaluation result
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon green-icon">
                      <Users size={21} />
                    </div>
                    <span className="stat-tag">Dataset</span>
                  </div>

                  <p className="stat-label">Dataset Records</p>
                  <h3>303</h3>
                  <p className="stat-description">
                    Cleveland Heart Disease dataset
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon orange-icon">
                      <ShieldCheck size={21} />
                    </div>
                    <span className="stat-tag">Threshold</span>
                  </div>

                  <p className="stat-label">Classification Threshold</p>
                  <h3>0.40</h3>
                  <p className="stat-description">
                    Provisional model setting
                  </p>
                </div>

              </section>

              <section className="dashboard-grid">

                <div className="panel quick-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>Quick Actions</h3>
                      <p>Access the main features of your system.</p>
                    </div>
                  </div>

                  <div className="quick-actions">

                    <button
                      className="quick-action"
                      onClick={() => handleNavigation("New Prediction")}
                    >
                      <div className="quick-action-icon blue-icon">
                        <ClipboardPlus size={22} />
                      </div>

                      <div>
                        <h4>New Prediction</h4>
                        <p>Enter patient details and generate a prediction.</p>
                      </div>

                      <ArrowUpRight size={19} className="action-arrow" />
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => handleNavigation("Model Insights")}
                    >
                      <div className="quick-action-icon purple-icon">
                        <ChartColumn size={22} />
                      </div>

                      <div>
                        <h4>Model Insights</h4>
                        <p>Explore feature importance and model behavior.</p>
                      </div>

                      <ArrowUpRight size={19} className="action-arrow" />
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => handleNavigation("Model Evaluation")}
                    >
                      <div className="quick-action-icon green-icon">
                        <Activity size={22} />
                      </div>

                      <div>
                        <h4>Model Evaluation</h4>
                        <p>Compare accuracy, recall and other metrics.</p>
                      </div>

                      <ArrowUpRight size={19} className="action-arrow" />
                    </button>

                    <button
                      className="quick-action"
                      onClick={() => handleNavigation("About Project")}
                    >
                      <div className="quick-action-icon green-icon">
                        <Info size={22} />
                      </div>

                      <div>
                        <h4>Project Information</h4>
                        <p>Understand the dataset and project methodology.</p>
                      </div>

                      <ArrowUpRight size={19} className="action-arrow" />
                    </button>

                  </div>
                </div>

                <div className="panel model-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>Model Overview</h3>
                      <p>Current model configuration.</p>
                    </div>

                    <Activity
                      size={20}
                      className="panel-heading-icon"
                    />
                  </div>

                  <div className="model-detail">
                    <span>Algorithm</span>
                    <strong>Logistic Regression</strong>
                  </div>

                  <div className="model-detail">
                    <span>Model Version</span>
                    <strong>1.0</strong>
                  </div>

                  <div className="model-detail">
                    <span>Classification Threshold</span>
                    <strong>0.40</strong>
                  </div>

                  <div className="model-detail">
                    <span>Explainability</span>
                    <strong className="enabled-text">SHAP Enabled</strong>
                  </div>

                  <div className="model-footer">
                    <Clock3 size={16} />
                    Experimental model configuration
                  </div>

                </div>

              </section>

              <section className="panel information-panel">

                <div className="information-icon">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3>Important Medical Disclaimer</h3>

                  <p>
                    This application is an educational machine learning
                    prototype trained on the Cleveland Heart Disease dataset.
                    Its predictions and estimated probabilities are not
                    medical diagnoses or validated clinical risk estimates.
                    Do not use this system to make medical decisions.
                  </p>
                </div>

              </section>

            </>
          )}

          {activePage === "New Prediction" && <Prediction />}

          {activePage === "Model Insights" && <ModelInsights />}

          {activePage === "Model Evaluation" && <ModelEvaluation />}

          {activePage === "About Project" && <AboutProject />}

          <footer className="page-footer">
            <span>CardioAI Prediction System</span>
            <span>Experimental Project · Version 1.2.0</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;
