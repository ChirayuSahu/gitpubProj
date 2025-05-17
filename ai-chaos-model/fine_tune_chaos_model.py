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
data_files = {"train": "ai_chaos_model_dataset.jsonl"}
dataset = load_dataset("json", data_files=data_files)

# Load tokenizer and model
model_checkpoint = "Salesforce/codet5-small"
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint, token=None)
model = AutoModelForSeq2SeqLM.from_pretrained(model_checkpoint, token=None)

# Preprocessing function with chaos enforcement
def preprocess(example):
    input_text = f"Level: {example['level']}\nCode:\n{example['prompt']}"
    target_text = example["completion"]

    # Enforce chaos: If target is too similar to prompt, force mutation
    similarity = difflib.SequenceMatcher(None, example["prompt"], target_text).ratio()
    if similarity > 0.9:
        # Simple forced chaos: replace first vowel or insert typo
        forced = example["prompt"].replace("a", "@", 1).replace("e", "3", 1)
        target_text = forced + "  # forced chaos"

    # Tokenize input and output
    model_inputs = tokenizer(input_text, max_length=128, truncation=True, padding="max_length")
    labels = tokenizer(text_target=target_text, max_length=128, truncation=True, padding="max_length")
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Tokenize dataset
tokenized_data = dataset.map(preprocess, batched=False)

# Training arguments
training_args = Seq2SeqTrainingArguments(
    output_dir="./chaos_model",
    per_device_train_batch_size=4,
    num_train_epochs=5,
    learning_rate=5e-5,
    save_strategy="epoch",
    logging_dir="./logs",
    predict_with_generate=True
)

# Trainer setup
data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data["train"],
    tokenizer=tokenizer,
    data_collator=data_collator,
)

# Train the model
trainer.train()

# Save model + tokenizer
model.save_pretrained("chaos_model")
tokenizer.save_pretrained("chaos_model")

print("model saved")