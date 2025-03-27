from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import requests
import json
from typing import Dict, List
import os
from dotenv import load_dotenv
import io
from datetime import datetime
import pytz
import logging

# Load environment variables
load_dotenv()

app = FastAPI(title="Real-Time Dashboard API")

# Configure CORS properly
origins = [
    "https://real-time-data-visualization-dashboard-seven.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Sheets setup
SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
RANGE_NAME = os.getenv('RANGE_NAME', 'Sheet1')

# Logging
logging.basicConfig(level=logging.INFO)

def get_sheet_data():
    try:
        # Correct Google Sheets CSV URL
        url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={RANGE_NAME}"
        logging.info(f"Fetching data from: {url}")

        response = requests.get(url)
        response.raise_for_status()  # Raise an error for non-200 responses

        # Convert CSV to DataFrame
        df = pd.read_csv(io.StringIO(response.text))

        # Add timestamp
        if 'Date' in df.columns and 'Time' in df.columns:
            df['timestamp'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
            df['timestamp'] = df['timestamp'].dt.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

        return df
    except Exception as e:
        logging.error(f"Failed to fetch data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Real-Time Dashboard API is running"}

@app.get("/data")
async def get_data():
    try:
        df = get_sheet_data()
        records = df.to_dict('records')

        return JSONResponse(
            content={
                "status": "success",
                "data": records,
                "timestamp": datetime.now(pytz.UTC).isoformat()
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "Internal server error",
                "details": str(e),
                "timestamp": datetime.now(pytz.UTC).isoformat()
            }
        )

@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "healthy"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
