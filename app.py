import os
import uuid
import json
import numpy as np
import matplotlib.pyplot as plt
import itertools

from flask import Flask, render_template, request, url_for
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ---- Config ----
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(APP_ROOT, "pneumonia_model_vgg16.h5")  # new model
UPLOAD_FOLDER = os.path.join(APP_ROOT, "static", "uploads")
CM_PATH = os.path.join(APP_ROOT, "static", "cm.png")
METRICS_CACHE = os.path.join(APP_ROOT, "metrics_cache.json")
TEST_DIR = os.path.join(APP_ROOT, "chest_xray", "test")
IMG_SIZE = (224, 224)  # match VGG16 input
BATCH_SIZE = 32

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(APP_ROOT, "static"), exist_ok=True)

# ---- Init Flask & Model ----
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

print("Loading model...")
model = load_model(MODEL_PATH)
print("Model loaded.")

# ---- Helpers ----
def preprocess_image_from_path(path):
    """Load and preprocess image for VGG16 model."""
    img = image.load_img(path, target_size=IMG_SIZE)
    arr = image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr

# Compute metrics for test set
def compute_and_cache_metrics():
    # If cache exists, just load it
    if os.path.exists(METRICS_CACHE):
        with open(METRICS_CACHE, "r") as f:
            data = json.load(f)
        return {
            "accuracy": data["accuracy"],
            "report": data["report"],
            "cm_path": url_for('static', filename='cm.png')
        }

    # Compute metrics
    datagen = ImageDataGenerator(rescale=1.0/255.0)
    test_gen = datagen.flow_from_directory(
        TEST_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="binary",
        shuffle=False
    )

    probs = model.predict(test_gen, verbose=1).ravel()
    y_true = test_gen.classes
    y_pred = (probs >= 0.5).astype(int)

    acc = float(accuracy_score(y_true, y_pred))
    report = classification_report(
        y_true, y_pred, target_names=["NORMAL", "PNEUMONIA"], output_dict=True
    )
    cm = confusion_matrix(y_true, y_pred)

    # Save confusion matrix
    labels = ["NORMAL", "PNEUMONIA"]
    plt.figure(figsize=(5,5))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.colorbar()
    tick_marks = np.arange(len(labels))
    plt.xticks(tick_marks, labels, rotation=45)
    plt.yticks(tick_marks, labels)
    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, format(cm[i, j], 'd'),
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.tight_layout()
    plt.savefig(CM_PATH)
    plt.close()

    # Cache metrics
    with open(METRICS_CACHE, "w") as f:
        json.dump({"accuracy": acc, "report": report}, f)

    return {
        "accuracy": acc,
        "report": report,
        "cm_path": url_for('static', filename='cm.png')
    }

# ---- Routes ----
@app.route("/", methods=["GET", "POST"])
def home():
    prediction = None
    prob = None
    image_url = None
    error = None

    if request.method == "POST":
        if 'file' not in request.files:
            error = "No file part"
        else:
            file = request.files["file"]
            if file.filename == "":
                error = "No file selected"
            else:
                ext = file.filename.rsplit(".", 1)[-1].lower()
                filename = f"{uuid.uuid4().hex}.{ext}"
                save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                file.save(save_path)

                # Predict
                x = preprocess_image_from_path(save_path)
                p = float(model.predict(x)[0][0])
                pred_label = "PNEUMONIA" if p >= 0.5 else "NORMAL"
                prediction = pred_label
                prob = {"NORMAL": round(1.0 - p, 4), "PNEUMONIA": round(p, 4)}
                image_url = url_for('static', filename=f'uploads/{filename}')

    return render_template("index.html", prediction=prediction, prob=prob, image_url=image_url, error=error)

@app.route("/metrics")
def metrics():
    data = compute_and_cache_metrics()
    report = data["report"]
    accuracy = data.get("accuracy")
    cm_url = data.get("cm_path")

    # Extract per-class metrics
    normal_metrics = report.get("NORMAL", {})
    pneumonia_metrics = report.get("PNEUMONIA", {})
    macro_avg = report.get("macro avg", {})
    weighted_avg = report.get("weighted avg", {})

    # <-- Replace the old render_template below with this one
    return render_template(
        "metrics.html",
        accuracy=accuracy,
        normal_metrics=normal_metrics,
        pneumonia_metrics=pneumonia_metrics,
        macro_avg=macro_avg,
        weighted_avg=weighted_avg,
        cm_path=cm_url
    )

@app.route("/about")
def about():
    return render_template("about.html")

# ---- Run ----
if __name__ == "__main__":
    app.run(debug=True)
