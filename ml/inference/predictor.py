from typing import Any, Protocol


class Predictor(Protocol):
    def predict(self, features: dict[str, float]) -> dict[str, Any]: ...


def predict_with_model(model: Predictor | None, features: dict[str, float]) -> dict[str, Any]:
    """Use a supplied trained model or return an explicit untrained state."""
    if model is None:
        return {"trained": False, "threat_class": None, "confidence": None}
    return {"trained": True, **model.predict(features)}