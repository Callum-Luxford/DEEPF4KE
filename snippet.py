import os

def ensure_directories_exist(base_path):
    frames_path = os.path.join(base_path, "frames")
    outputs_path = os.path.join(base_path, "outputs")

    for path in [frames_path, outputs_path]:
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created missing directory: {path}")
        else:
            print(f"Directory already exists: {path}")

# Ensure directories exist before processing
uploads_path = "server/uploads"
ensure_directories_exist(uploads_path)
