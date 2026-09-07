import os


READ_ONLY = os.getenv("NEXUS_READ_ONLY", "true").lower() == "true"
DEFINED_THROUGHPUT_TARGET = os.getenv("DEFINED_THROUGHPUT_TARGET") or None