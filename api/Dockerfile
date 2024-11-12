# Use Python 3.9 slim as the base image
FROM python:3.9-slim

RUN addgroup --system appgroup && adduser --system --group appuser

# Set the working directory
WORKDIR /TODOApp

# Copy the app code and requirements
COPY ./app ./app
COPY ./requirements.txt ./
COPY ./wait_for_db.py ./

# Install dependencies
RUN pip install -r requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Switch to non-root user
USER appuser

CMD ["sh", "-c", "python3 wait_for_db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
