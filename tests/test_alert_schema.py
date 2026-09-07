from ingestion.schemas import FlowRecord


def test_flow_schema_has_no_payload_field():
    assert "payload" not in FlowRecord.model_fields