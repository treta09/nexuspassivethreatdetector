"""Schemas accepted from passive capture sources; payload fields are absent by design."""

from datetime import datetime, timezone
from pydantic import BaseModel, Field


class FlowRecord(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    flow_id: str
    src_ip: str
    dst_ip: str
    src_port: int = 0
    dst_port: int = 0
    protocol: str = "UNKNOWN"
    packet_count: int = 0
    byte_count: int = 0
    tcp_flags: str = ""
    duration: float = 0.0
    metadata: dict[str, str | float | int] = Field(default_factory=dict)