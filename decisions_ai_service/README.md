# Decisions AI Service

This project provides an AI-powered decision-fetching service.

## Setup

1. **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Service

Start the service using `uvicorn`:

```bash
uvicorn pandas_service:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at `http://127.0.0.1:8000`.

## Example Query with `curl`

```bash
curl -X POST "http://127.0.0.1:8000/query" \
      -H "Content-Type: application/json" \
      -d '{"input": "your data here"}'
curl -X POST http://localhost:8000/query  \
    -H "Content-Type: application/json"  \ 
    -d '{"question": "תמצא לי 5 החלטות שקשורות לתחום הבריאות. \n\n**Answer in natural language, not a dataframe**"}'
```

Replace the endpoint and payload as needed for your API.
