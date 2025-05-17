from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = Flask(__name__)

print("📦 Loading tokenizer and model from: chaos_model")
tokenizer = AutoTokenizer.from_pretrained("chaos_model")
model = AutoModelForSeq2SeqLM.from_pretrained("chaos_model")
model.eval()

@app.route("/generate-chaos", methods=["POST"])
def generate_chaos():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

        with torch.no_grad():
            outputs = model.generate(**inputs, max_length=128)

        result = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return jsonify({"completion": result})
    except Exception as e:
        print("❌ Model Error:", e)
        return jsonify({"completion": "// model failed"}), 500

if __name__ == "__main__":
    print("🚀 Flask model API running on port 8000...")
    app.run(host="0.0.0.0", port=8000, debug=True)