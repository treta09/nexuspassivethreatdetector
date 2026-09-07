from pydantic import BaseModel, Field


class DetectionResult(BaseModel):
    threat_class: str | None = None
    confidence: float | None = None
    anomaly_score: float | None = None
    evidence: dict = Field(default_factory=dict)