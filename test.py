import onnx
from onnx import helper
from onnx import TensorProto

# Define a simple computation graph
input_tensor = helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 3, 224, 224])
output_tensor = helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 3, 224, 224])


node = helper.make_node(
    "Relu",  # Example operation
    inputs=["input"],
    outputs=["output"]
)

graph = helper.make_graph(
    nodes=[node],
    name="SimpleGraph",
    inputs=[input_tensor],
    outputs=[output_tensor]
)

# Specify Opset version explicitly
opset_version = 21  # Adjust to a supported version
model = helper.make_model(graph, producer_name="onnx-example")
model.opset_import[0].version = opset_version

onnx.save(model, "simple_model.onnx")

print(f"Dummy ONNX model saved as 'simple_model.onnx' with Opset {opset_version}")
