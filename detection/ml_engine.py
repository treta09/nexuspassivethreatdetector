from ml.inference.predictor import predict_with_model


def evaluate(model, features):
    return predict_with_model(model, features)