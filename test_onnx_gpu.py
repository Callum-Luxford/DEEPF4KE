import onnxruntime as ort

# Path to the dummy ONNX model
model_path = "simple_model.onnx"

# Test GPU availability
providers = ort.get_available_providers()
print(f"Available execution providers: {providers}")

try:
    # Create an ONNX session using CUDAExecutionProvider
    session = ort.InferenceSession(model_path, providers=["CUDAExecutionProvider"])
    print("Successfully created an ONNX session using CUDAExecutionProvider.")
except Exception as e:
    print(f"Failed to create ONNX session with CUDAExecutionProvider: {e}")




