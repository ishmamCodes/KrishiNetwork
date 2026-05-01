import { useState } from "react";
import axios from "axios";

const ML_API_URL = import.meta.env.VITE_ML_API_URL || "http://localhost:8000";

const severityColor = {
  None: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
  Unknown: "bg-gray-100 text-gray-800",
};

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!image) return alert("Please upload a plant image first.");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await axios.post(`${ML_API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            🌿 Plant Disease Detection
          </h1>
          <p className="text-gray-500 text-sm">
            Upload a photo of a plant leaf and our AI will identify any diseases instantly.
          </p>
        </div>

        {/* Upload Box */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <label className="block w-full cursor-pointer">
            <div className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 transition ${
              preview ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }`}>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-contain"
                />
              ) : (
                <>
                  <span className="text-5xl mb-3">📷</span>
                  <p className="text-gray-500 text-sm">Click to upload a leaf image</p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG supported</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDetect}
              disabled={!image || loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Analyzing..." : "🔍 Detect Disease"}
            </button>
            {preview && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-600 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="animate-spin text-4xl mb-3">🌀</div>
            <p className="text-gray-500">Analyzing your plant image...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Detection Result</h2>

            {/* Main Disease */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Detected Disease</p>
                <p className="text-lg font-semibold text-gray-800">
                  {result.disease.replace(/___/g, " → ").replace(/_/g, " ")}
                </p>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${severityColor[result.severity]}`}>
                {result.severity}
              </span>
            </div>

            {/* Confidence */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Confidence</p>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{result.confidence}%</p>
            </div>

            {/* Cause & Treatment */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">🦠 Cause</p>
                <p className="text-sm text-yellow-700">{result.cause}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">💊 Treatment</p>
                <p className="text-sm text-blue-700">{result.treatment}</p>
              </div>
            </div>

            {/* Top 3 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Top 3 Predictions</p>
              <div className="space-y-2">
                {result.top3.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {i + 1}. {item.disease.replace(/___/g, " → ").replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-500 font-medium">{item.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}