"""Statistical feature boundary for measured flow windows."""


def summarize(values: list[float]) -> dict[str, float]:
    if not values:
        return {}
    return {"mean": sum(values) / len(values), "min": min(values), "max": max(values)}