# src/ai/probate/will_parser.py
from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch

class WillParser:
    def __init__(self, model_path="nlpaueb/legal-bert-base-uncased"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        # Using a model with pre-trained legal-vocabulary weights
        self.model = AutoModelForTokenClassification.from_pretrained(model_path, num_labels=5)
        self.labels = {0: "O", 1: "TESTATOR", 2: "EXECUTOR", 3: "BEQUEST", 4: "CONDITION"}

    def parse(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        predictions = torch.argmax(outputs.logits, dim=-1)[0]
        tokens = self.tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
        
        extracted_entities = []
        for token, pred_id in zip(tokens, predictions):
            label = self.labels[pred_id.item()]
            if label != "O" and not token.startswith("[PAD]"):
                extracted_entities.append((token, label))
        return extracted_entities

if __name__ == "__main__":
    parser = WillParser()
    sample_text = "I appoint Eleanor Rigby as the executor of my estate and bequeath 1847 Elm Street to Maxwell Silver."
    entities = parser.parse(sample_text)
    print("[Will Parser Output]:", entities)
