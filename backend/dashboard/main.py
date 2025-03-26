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

# Load environment variables
load_dotenv()

app = FastAPI(title="Real-Time Dashboard API")

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Google Sheets setup
SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
RANGE_NAME = os.getenv('RANGE_NAME', 'Sheet1!A:K')

def get_sheet_data():
    try:
        # Construct the public URL
        url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={RANGE_NAME}"
        
        # Fetch data using requests
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Convert CSV to DataFrame
        df = pd.read_csv(pd.StringIO(response.text))
        
        # Add timestamp for chart
        df['timestamp'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
        
        return df
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Real-Time Dashboard API is running"}

@app.get("/data")
async def get_data():
    try:
        # Get the spreadsheet ID and range from environment variables
        spreadsheet_id = os.getenv("SPREADSHEET_ID")
        range_name = os.getenv("RANGE_NAME")
        
        if not spreadsheet_id or not range_name:
            print("Missing environment variables:", {
                "SPREADSHEET_ID": bool(spreadsheet_id),
                "RANGE_NAME": bool(range_name)
            })
            raise HTTPException(status_code=500, detail="Missing spreadsheet configuration")
        
        # Construct the CSV export URL
        url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&range={range_name}"
        print(f"Fetching data from URL: {url}")
        
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/csv,application/json',
            'Content-Type': 'application/json'
        }
        
        # Fetch data with timeout and headers
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Read CSV data
        df = pd.read_csv(io.StringIO(response.text))
        
        # Convert timestamp to ISO format
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['timestamp'] = df['timestamp'].dt.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        
        # Convert DataFrame to records
        records = df.to_dict('records')
        
        return JSONResponse(
            content={"data": records},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "false"
            }
        )
        
    except requests.exceptions.RequestException as e:
        print(f"Network error: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"error": "Failed to fetch data from Google Sheets", "details": str(e)},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "false"
            }
        )
    except Exception as e:
        print(f"Error processing data: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "details": str(e)},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "false"
            }
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 