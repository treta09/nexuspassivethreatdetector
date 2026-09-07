from pydantic import BaseModel, Field


class Alert(BaseModel):
    timestamp: str
    flow_id: str
    threat_class: str | None = None
    confidence: float | None = None
    severity: str
    evidence: dict = Field(default_factory=dict)