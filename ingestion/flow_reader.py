"""Adapters for NetFlow, IPFIX, and sFlow records."""

from collections.abc import Iterable, Mapping
from .schemas import FlowRecord


def read_flow_records(records: Iterable[Mapping[str, object]]) -> Iterable[FlowRecord]:
    """Normalize records supplied by a passive collector; never opens a network connection."""
    for record in records:
        yield FlowRecord.model_validate(record)