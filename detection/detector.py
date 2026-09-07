from .evidence import standardized_evidence
from .severity import severity_for_confidence


def detect(features, threat_class=None, confidence=None):
    return {"threat_class": threat_class, "confidence": confidence, "severity": severity_for_confidence(confidence or 0), "evidence": standardized_evidence(features)}