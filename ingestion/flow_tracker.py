"""5-tuple flow tracking boundary."""


class FlowTracker:
    def observe(self, _packet_metadata):
        raise NotImplementedError("Implement bounded 5-tuple tracking for passive metadata")