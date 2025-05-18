from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    DataCollatorForSeq2Seq
)
from datasets import load_dataset
import difflib

# Load dataset
print("📦 Loading dataset...")
data_files = {"train": "ai_chaos_model_dataset.jsonl"}
dataset = load_dataset("json", data_files=data_files)

# Load tokenizer and model
model_checkpoint = "Salesforce/codet5-base"
print(f"🔁 Loading model: {model_checkpoint}")
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
model = AutoModelForSeq2SeqLM.from_pretrained(model_checkpoint)

# Preprocessing function
print("⚙️ Tokenizing data...")
def preprocess(example):
    input_text = f"Level: {example['level']}\nCode:\n{example['prompt']}"
    target_text = example["completion"]
    model_inputs = tokenizer(input_text, max_length=256, truncation=True, padding="max_length")
    labels = tokenizer(text_target=target_text, max_length=256, truncation=True, padding="max_length")
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

tokenized = dataset["train"].map(preprocess, batched=False)
split = tokenized.train_test_split(test_size=0.1, seed=42)
train_dataset = split["train"]
eval_dataset = split["test"]

# Training arguments
print("🚀 Preparing training arguments...")
from transformers import Seq2SeqTrainingArguments

training_args = Seq2SeqTrainingArguments(
    output_dir="./chaos_model",
    per_device_train_batch_size=2,
    num_train_epochs=5,
    learning_rate=5e-5,
    save_strategy="epoch",            # still valid
    logging_dir="./logs",             # for TensorBoard or logging
    predict_with_generate=True        # for text generation tasks
)

data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator
)

# Train the model
print("🏋️‍♂️ Starting training...")
trainer.train()

# Save model and tokenizer
print("💾 Saving model...")
model.save_pretrained("chaos_model")
tokenizer.save_pretrained("chaos_model")

print("model saved")