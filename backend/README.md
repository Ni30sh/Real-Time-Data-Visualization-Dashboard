# Real-Time Dashboard Backend

This is the backend service for the Real-Time Dashboard application. It provides API endpoints to fetch and serve data from a Google Sheet.

## Setup

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `SPREADSHEET_ID` with your Google Sheet ID
   - Update other variables as needed

4. Run the development server:
   ```bash
   uvicorn dashboard.main:app --reload
   ```

## API Endpoints

- `GET /`: Health check endpoint
- `GET /data`: Fetch data from Google Sheet
- `GET /health`: Health check endpoint

## Environment Variables

- `SPREADSHEET_ID`: The ID of your Google Sheet
- `RANGE_NAME`: The range of cells to fetch (default: Sheet1!A:K)
- `PORT`: The port to run the server on (default: 8000)

## Development

The backend is built with:
- FastAPI
- Pandas
- Python-dotenv
- Uvicorn

## Deployment

The backend is configured for deployment on Render. The `Procfile` specifies how to start the application using Gunicorn with Uvicorn workers. 