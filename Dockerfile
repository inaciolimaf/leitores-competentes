# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# --- Stage 2: Runtime Backend ---
FROM python:3.12-slim
WORKDIR /app

# System dependencies for PDF generation if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend to backend static directory
RUN mkdir -p /app/app/static/frontend
COPY --from=frontend-builder /app/frontend/dist /app/app/static/frontend

# Environment variables for production
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
ENV DATA_DIR=/data

# Create directory for persistent data (Volume mount point)
RUN mkdir -p /data/static/images /data/static/exports

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
