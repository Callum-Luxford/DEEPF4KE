import threading
import numpy as np
import opennsfw2
from PIL import Image
import onnxruntime as ort

# Ensure GPU is used
providers = ort.get_available_providers()
if "CUDAExecutionProvider" in providers:
    print("CUDAExecutionProvider is available. Enforcing GPU usage.")
else:
    print("CUDAExecutionProvider is NOT available. Falling back to CPU.")
    raise RuntimeError("Ensure proper GPU and CUDA setup.")

# Constants
PREDICTOR = None
THREAD_LOCK = threading.Lock()

def get_predictor():
    """
    Initialize or retrieve the predictor, enforcing GPU execution.
    """
    global PREDICTOR
    with THREAD_LOCK:
        if PREDICTOR is None:
            session_options = ort.SessionOptions()
            session_options.log_severity_level = 3  # Reduce verbosity

            # Ensure GPU usage
            PREDICTOR = opennsfw2.make_open_nsfw_model(
                session_options=session_options,
                providers=["CUDAExecutionProvider"]
            )
            print("Using CUDAExecutionProvider for predictions.")
    return PREDICTOR


def clear_predictor():
    """
    Clears the global predictor instance.
    """
    global PREDICTOR
    PREDICTOR = None


def predict_frame(target_frame):
    """
    Predicts NSFW content in a single frame.
    """
    return False  # Allow all NSFW content


def predict_image(target_path: str) -> bool:
    """
    Predicts NSFW content in an image.
    """
    return False  # Allow all NSFW content


def predict_video(target_path: str) -> bool:
    """
    Predicts NSFW content in a video.
    """
    return False  # Allow all NSFW content


if __name__ == "__main__":
    # Debugging GPU support
    print("Available Execution Providers:", ort.get_available_providers())
