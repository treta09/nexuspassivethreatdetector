"""Flow-level metadata features."""

from ingestion.schemas import FlowRecord


def flow_features(flow: FlowRecord) -> dict[str, float]:
    return {"packet_count": float(flow.packet_count), "byte_count": float(flow.byte_count), "duration": flow.duration}