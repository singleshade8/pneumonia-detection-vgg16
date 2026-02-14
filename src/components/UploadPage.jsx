import React, { useState } from "react";
import "./UploadPage.css";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPrediction(null);
    setMetrics(null);
    setActiveTab("results");
    setError("");
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("⚠️ Please upload an image!");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    const dummyMetrics = {
      overall_accuracy: 0.93,
      class_metrics: [
        { class: "Normal", precision: "0.94", recall: "0.96", f1_score: "0.95", support: 220 },
        { class: "Pneumonia", precision: "0.89", recall: "0.91", f1_score: "0.90", support: 180 },
      ],
      macro_avg: { precision: "0.91", recall: "0.93", f1_score: "0.92", support: 400 },
      weighted_avg: { precision: "0.92", recall: "0.93", f1_score: "0.93", support: 400 },
      confusion_matrix_url:
        "https://raw.githubusercontent.com/plotly/datasets/master/heatmap_confusion_matrix.png",
    };

    const possibleResults = ["🟢 Normal", "🟠 Pneumonia Detected"];
    const randomPrediction = possibleResults[Math.floor(Math.random() * possibleResults.length)];

    setPrediction(randomPrediction);
    setMetrics(dummyMetrics);
    setLoading(false);
  };

  const renderRecommendations = () => {
    if (!prediction) return null;

    if (prediction.includes("Normal")) {
      return (
        <ul>
          <li>✅ Lungs appear clear and healthy.</li>
          <li>Maintain a balanced diet and regular exercise.</li>
          <li>Continue routine health check-ups.</li>
          <li>Consult a doctor if any new respiratory symptoms appear.</li>
        </ul>
      );
    } else if (prediction.includes("Pneumonia")) {
      return (
        <ul>
          <li>🩺 Indicators suggest pneumonia — further clinical evaluation is advised.</li>
          <li>Schedule a chest CT and complete blood test.</li>
          <li>Follow your physician’s antibiotic regimen carefully.</li>
          <li>Ensure rest, hydration, and regular temperature monitoring.</li>
        </ul>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="upload-results-row">
        <div className="upload-card">
          <h2>🩻 Upload Chest X-Ray</h2>
          <p>Upload a clear chest X-ray image for analysis</p>

          <div
            className="custom-dropzone"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <p>📂 Click or Drop X-ray Here</p>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          <div className="button-row">
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze X-Ray"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>

        {prediction && metrics && (
          <div className="results-card">
            <div className="toggle-tabs">
              <button
                className={`toggle-btn ${activeTab === "results" ? "active" : ""}`}
                onClick={() => setActiveTab("results")}
              >
                Detection Results
              </button>
              <button
                className={`toggle-btn ${activeTab === "metrics" ? "active" : ""}`}
                onClick={() => setActiveTab("metrics")}
              >
                Model Metrics
              </button>
            </div>

            {activeTab === "results" ? (
              <div className="results-content fade-in">
                <div className="result-box success">
                  <h3>🧠 Detection Results</h3>
                  <p>{prediction}</p>
                </div>

                <div className="clinical-card">
                  <h3>📋 Clinical Recommendations</h3>
                  {renderRecommendations()}
                </div>
              </div>
            ) : (
              <div className="metrics-section fade-in">
                <h3>📊 Model Evaluation Metrics</h3>

                <div className="accuracy-box">
                  <h4>Overall Accuracy</h4>
                  <p>{(metrics.overall_accuracy * 100).toFixed(2)}%</p>
                </div>

                <h4>Per-Class Metrics</h4>
                <table className="metrics-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1-Score</th>
                      <th>Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.class_metrics.map((m, i) => (
                      <tr key={i}>
                        <td>{m.class}</td>
                        <td>{m.precision}</td>
                        <td>{m.recall}</td>
                        <td>{m.f1_score}</td>
                        <td>{m.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h4>Averages</h4>
                <table className="metrics-table">
                  <tbody>
                    <tr>
                      <td>Macro Avg</td>
                      <td>{metrics.macro_avg.precision}</td>
                      <td>{metrics.macro_avg.recall}</td>
                      <td>{metrics.macro_avg.f1_score}</td>
                      <td>{metrics.macro_avg.support}</td>
                    </tr>
                    <tr>
                      <td>Weighted Avg</td>
                      <td>{metrics.weighted_avg.precision}</td>
                      <td>{metrics.weighted_avg.recall}</td>
                      <td>{metrics.weighted_avg.f1_score}</td>
                      <td>{metrics.weighted_avg.support}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="confusion-matrix">
                  <h4>Confusion Matrix</h4>
                  <img
                    src={metrics.confusion_matrix_url}
                    alt="Confusion Matrix"
                    className="confusion-img"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
