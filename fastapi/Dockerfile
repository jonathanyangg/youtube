# fastapi/Dockerfile
FROM python:3.10-alpine

WORKDIR /app

# Install CA certificates ──> 🔑
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Copy requirements first (better layer caching)
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]