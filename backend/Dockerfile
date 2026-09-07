FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY ingestion /app/ingestion
COPY feature_engineering /app/feature_engineering
COPY detection /app/detection
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]