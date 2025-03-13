import argparse
import os
import subprocess
import onnxruntime as ort
from roop import core
import shutil

# Automatically detect FFmpeg location
ffmpeg_path = shutil.which("ffmpeg")

if not ffmpeg_path:
    print("FFmpeg not found! Please install it and ensure it's in your system PATH.")
    exit(1)

print(f"FFmpeg found at: {ffmpeg_path}")


# Argument parser
parser = argparse.ArgumentParser()
parser.add_argument("-s", "--source", required=True, help="Source image path")
parser.add_argument("-t", "--target", required=True, help="Target video path")
parser.add_argument("-o", "--output", required=True, help="Output video path")
parser.add_argument("--execution-provider", choices=["tensorrt", "cuda", "cpu"], default="cpu", help="Execution provider to use")
args = parser.parse_args()

# Map execution provider argument
execution_provider_map = {
    "tensorrt": "TensorrtExecutionProvider",
    "cuda": "CUDAExecutionProvider",
    "cpu": "CPUExecutionProvider"
}
execution_provider = execution_provider_map[args.execution_provider]

# Debugging: Verify FFmpeg
try:
    subprocess.run(["ffmpeg", "-version"], check=True)
    print("FFmpeg is correctly detected within the script.")
except FileNotFoundError:
    print("FFmpeg is not detected. Ensure the path is correctly set.")
    exit(1)

# Verify CUDA availability if "cuda" is specified
if execution_provider == "CUDAExecutionProvider":
    providers = ort.get_available_providers()
    if "CUDAExecutionProvider" not in providers:
        raise RuntimeError("CUDAExecutionProvider is not available. Falling back to CPU.")

# Run core logic
if __name__ == "__main__":
    try:
        print(f"Using {execution_provider} for execution.")
        print(f"Source Path: {args.source}")
        print(f"Target Path: {args.target}")
        print(f"Output Path: {args.output}")
        core.run()
    except Exception as e:
        print(f"An error occurred: {e}")
