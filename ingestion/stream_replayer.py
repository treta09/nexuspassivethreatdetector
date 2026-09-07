"""Operator-controlled PCAP replay boundary; replay is read-only."""


def replay(_records, _rate=None):
    raise NotImplementedError("Supply an approved PCAP replay implementation")