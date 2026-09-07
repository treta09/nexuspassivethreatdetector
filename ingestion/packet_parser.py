"""Packet metadata parser boundary; payload bytes must never be returned."""


def parse_packet(_packet):
    raise NotImplementedError("Connect an approved metadata-only packet parser")