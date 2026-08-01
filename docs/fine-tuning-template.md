# RamSetu Fine-Tuning Template

Use this document as the standard template for any future fine-tuning work related to the RamSetu banking assistant.

## 1. Objective

- Use case:
- Target touchpoint:
- Expected behavior:
- Success criteria:

## 2. Scope

- Domain focus:
- Supported languages:
- Supported intents / workflows:
- Out-of-scope requests:

## 3. Base Model

- Provider / model family:
- Base checkpoint / version:
- Reason for selection:

## 4. Dataset Definition

### Training Data

- Dataset name:
- Source:
- Total samples:
- Split: train / validation / test
- Data format:
- Example fields:
  - `input`
  - `instruction`
  - `output`
  - `metadata`

### Data Quality Rules

- Remove duplicates
- Remove PII unless explicitly approved
- Keep only verified banking policy / procedure references
- Normalize regional-language examples to a consistent format

## 5. Task Formulation

- Primary task:
- Secondary task:
- Prompt style:
- Response contract:
- Safety constraints:

## 6. Fine-Tuning Strategy

- Training method:
  - Full fine-tune
  - LoRA / PEFT
  - Adapter
- Reason:
- Parameter budget:
- Epochs:
- Learning rate:
- Batch size:
- Max sequence length:

## 7. Evaluation Plan

### Automatic Metrics

- Accuracy:
- Precision / Recall / F1:
- BLEU / ROUGE / exact match (if applicable):

### Human Review Checklist

- Factual correctness
- Regional-language quality
- Escalation behavior
- Unsafe / policy-violating output detection

## 8. Safety & Compliance

- Banking policy handling:
- Refusal behavior:
- Sensitive-data policy:
- Audit logging requirement:

## 9. Deployment Notes

- Intended environment:
- Serving endpoint:
- Token budget:
- Latency goal:
- Rollout strategy:

## 10. Final Approval Checklist

- [ ] Dataset reviewed and cleaned
- [ ] Prompt format approved
- [ ] Training config frozen
- [ ] Evaluation metrics defined
- [ ] Safety constraints documented
- [ ] Deployment owner assigned

## 11. Example Prompt Template

```text
System:
You are RamSetu, a secure banking self-service assistant.
Follow banking policy, avoid hallucinations, and escalate when a request falls outside approved workflows.

User:
<customer_query>

Assistant:
<safe_banking_response>
```
