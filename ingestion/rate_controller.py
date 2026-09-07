"""Rate-control policy boundary. No default target is invented."""


def configured_rate(value):
    if value in (None, ""):
        return None
    return float(value)