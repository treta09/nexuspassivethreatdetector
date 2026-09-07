from feature_engineering.entropy_features import shannon_entropy


def test_empty_entropy_is_zero():
    assert shannon_entropy("") == 0.0