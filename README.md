🩺 Pneumonia Detection from Chest X-Ray (VGG16 + Flask)

An end-to-end deep learning project to detect pneumonia from chest X-ray images using VGG16 transfer learning.
Includes a Flask web app for real-time predictions and supports both CPU (Windows) and GPU (WSL2) execution.

🚀 Features

Chest X-ray image classification (NORMAL vs PNEUMONIA)

Transfer Learning with VGG16

Data augmentation & class imbalance handling

Model evaluation (accuracy, confusion matrix, classification report)

Flask web UI for uploading X-rays and viewing predictions

CPU (Windows) and GPU (WSL2) support

📂 Dataset

This project uses the Chest X-Ray Pneumonia dataset from Kaggle:

🔗 https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia

Folder structure after extraction:

chest_xray/
├── train/
├── val/
└── test/


⚠️ The dataset is not included in this repository due to size limits.

🗺️ Which Setup Should I Use?
💻 Windows (CPU only)

Use this if you don’t want to deal with GPU/WSL.

Click in this order:

setup_win.bat ✅ (run once)

run_win.bat ▶️ (run every time to start the app)

Open in browser: http://localhost:5000

🚀 Windows + NVIDIA GPU (WSL2)

Use this for faster training/inference with GPU.

Click in this order:

setup_wsl.bat ✅ (run once)

run_wsl.bat ▶️ (run every time to start the app)

ℹ️ If your system does not have a GPU, this will still run on CPU inside WSL (slower).

🧠 Training the Model (Optional)

Train on Windows (CPU): train_win.bat

Train on WSL (GPU): train_wsl.bat

The trained model is saved as:

pneumonia_model_vgg16.h5


⚠️ The model file is not included in this repo due to GitHub size limits.
Download it separately (or train the model yourself) and place it in the project root.

⚙️ Tech Stack

TensorFlow / Keras – Deep learning model

VGG16 – Transfer learning backbone

Flask – Web application backend

OpenCV / Pillow – Image preprocessing

scikit-learn – Evaluation metrics

WSL2 + CUDA (optional) – GPU acceleration

📊 Results (Example)

Accuracy: ~92%

Confusion Matrix and classification report available on the /metrics page in the app.
