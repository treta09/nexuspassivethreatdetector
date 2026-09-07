SEVERITIES = ("CRITICAL", "HIGH", "MEDIUM", "LOW")


def severity_for_confidence(confidence: float) -> str:
    if confidence >= 0.9:
        return "CRITICAL"
    if confidence >= 0.75:
        return "HIGH"
    if confidence >= 0.5:
        return "MEDIUM"
    return "LOW"