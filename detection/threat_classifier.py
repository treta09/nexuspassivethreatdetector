def classify(rule_result, model_result):
    return model_result if model_result.get("trained") else rule_result