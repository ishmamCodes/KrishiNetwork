from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and class names on startup
print("Loading model...")
model = tf.keras.models.load_model("best_model.keras")
print("Model loaded!")

with open("class_names.json", "r") as f:
    class_indices = json.load(f)

# Reverse the dict: {0: 'Apple___scab', 1: ...}
class_names = {v: k for k, v in class_indices.items()}

# Disease info map
disease_info = {
    "Apple___Apple_scab": {"cause": "Fungal (Venturia inaequalis)", "treatment": "Apply fungicide early spring. Remove fallen leaves.", "severity": "Medium"},
    "Apple___Black_rot": {"cause": "Fungal (Botryosphaeria obtusa)", "treatment": "Prune infected branches. Apply copper fungicide.", "severity": "High"},
    "Apple___Cedar_apple_rust": {"cause": "Fungal (Gymnosporangium juniperi)", "treatment": "Apply fungicide in spring. Remove nearby juniper trees.", "severity": "Medium"},
    "Apple___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Blueberry___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Cherry_(including_sour)___Powdery_mildew": {"cause": "Fungal (Podosphaera clandestina)", "treatment": "Apply sulfur-based fungicide. Improve air circulation.", "severity": "Medium"},
    "Cherry_(including_sour)___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {"cause": "Fungal (Cercospora zeae-maydis)", "treatment": "Use resistant varieties. Apply strobilurin fungicide.", "severity": "High"},
    "Corn_(maize)___Common_rust_": {"cause": "Fungal (Puccinia sorghi)", "treatment": "Apply fungicide at early infection. Use resistant hybrids.", "severity": "Medium"},
    "Corn_(maize)___Northern_Leaf_Blight": {"cause": "Fungal (Exserohilum turcicum)", "treatment": "Apply fungicide. Use resistant varieties.", "severity": "High"},
    "Corn_(maize)___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Grape___Black_rot": {"cause": "Fungal (Guignardia bidwellii)", "treatment": "Apply fungicide before rain. Remove mummified fruits.", "severity": "High"},
    "Grape___Esca_(Black_Measles)": {"cause": "Fungal complex", "treatment": "No cure. Remove infected wood. Protect wounds.", "severity": "High"},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {"cause": "Fungal (Isariopsis clavispora)", "treatment": "Apply copper fungicide. Improve vineyard drainage.", "severity": "Medium"},
    "Grape___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Orange___Haunglongbing_(Citrus_greening)": {"cause": "Bacterial (Candidatus Liberibacter)", "treatment": "No cure. Remove infected trees. Control psyllid insects.", "severity": "Critical"},
    "Peach___Bacterial_spot": {"cause": "Bacterial (Xanthomonas campestris)", "treatment": "Apply copper bactericide. Avoid overhead irrigation.", "severity": "Medium"},
    "Peach___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Pepper,_bell___Bacterial_spot": {"cause": "Bacterial (Xanthomonas campestris)", "treatment": "Use disease-free seeds. Apply copper-based bactericide.", "severity": "Medium"},
    "Pepper,_bell___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Potato___Early_blight": {"cause": "Fungal (Alternaria solani)", "treatment": "Apply chlorothalonil fungicide. Remove infected leaves.", "severity": "Medium"},
    "Potato___Late_blight": {"cause": "Oomycete (Phytophthora infestans)", "treatment": "Apply systemic fungicide immediately. Destroy infected plants.", "severity": "Critical"},
    "Potato___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Raspberry___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Soybean___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Squash___Powdery_mildew": {"cause": "Fungal (Podosphaera xanthii)", "treatment": "Apply potassium bicarbonate or sulfur fungicide.", "severity": "Medium"},
    "Strawberry___Leaf_scorch": {"cause": "Fungal (Diplocarpon earlianum)", "treatment": "Apply fungicide. Remove infected leaves. Improve drainage.", "severity": "Medium"},
    "Strawberry___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
    "Tomato___Bacterial_spot": {"cause": "Bacterial (Xanthomonas vesicatoria)", "treatment": "Use copper bactericide. Avoid overhead watering.", "severity": "High"},
    "Tomato___Early_blight": {"cause": "Fungal (Alternaria solani)", "treatment": "Apply fungicide. Remove lower infected leaves.", "severity": "Medium"},
    "Tomato___Late_blight": {"cause": "Oomycete (Phytophthora infestans)", "treatment": "Apply systemic fungicide. Destroy infected plants immediately.", "severity": "Critical"},
    "Tomato___Leaf_Mold": {"cause": "Fungal (Passalora fulva)", "treatment": "Improve ventilation. Apply fungicide.", "severity": "Medium"},
    "Tomato___Septoria_leaf_spot": {"cause": "Fungal (Septoria lycopersici)", "treatment": "Apply fungicide. Remove infected leaves. Avoid wetting foliage.", "severity": "Medium"},
    "Tomato___Spider_mites Two-spotted_spider_mite": {"cause": "Pest (Tetranychus urticae)", "treatment": "Apply miticide or neem oil. Increase humidity.", "severity": "Medium"},
    "Tomato___Target_Spot": {"cause": "Fungal (Corynespora cassiicola)", "treatment": "Apply fungicide. Remove infected plant debris.", "severity": "Medium"},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"cause": "Viral (TYLCV via whitefly)", "treatment": "No cure. Control whitefly. Remove infected plants.", "severity": "Critical"},
    "Tomato___Tomato_mosaic_virus": {"cause": "Viral (ToMV)", "treatment": "No cure. Remove infected plants. Disinfect tools.", "severity": "High"},
    "Tomato___healthy": {"cause": "None", "treatment": "No treatment needed.", "severity": "None"},
}

@app.get("/")
def root():
    return {"status": "KrishiNetwork ML API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read and preprocess image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    predictions = model.predict(img_array)
    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0])) * 100

    # Get class name
    predicted_class = class_names[predicted_index]

    # Get top 3 predictions
    top3_indices = np.argsort(predictions[0])[-3:][::-1]
    top3 = [
        {
            "disease": class_names[int(i)],
            "confidence": round(float(predictions[0][i]) * 100, 2)
        }
        for i in top3_indices
    ]

    # Get disease info
    info = disease_info.get(predicted_class, {
        "cause": "Unknown",
        "treatment": "Consult an agricultural expert.",
        "severity": "Unknown"
    })

    return {
        "disease": predicted_class,
        "confidence": round(confidence, 2),
        "cause": info["cause"],
        "treatment": info["treatment"],
        "severity": info["severity"],
        "top3": top3
    }