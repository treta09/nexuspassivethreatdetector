def clamp(value):
    return None if value is None else max(0.0, min(1.0, float(value)))