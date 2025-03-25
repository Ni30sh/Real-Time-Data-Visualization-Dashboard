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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        df = get_sheet_data()
        return {"data": df.to_dict(orient='records')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 