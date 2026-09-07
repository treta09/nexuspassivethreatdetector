from typing import Any


def standardized_evidence(features: dict[str, Any]) -> dict[str, Any]:
    """Return explainable feature evidence without packet payloads."""
    return {key: value for key, value in features.items() if value is not None}