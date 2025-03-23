
# Real-Time Data Visualization Dashboard

A modern web dashboard that fetches and displays real-time data from a public Google Sheet, built with React and FastAPI.

## Features

- Real-time data fetching from public Google Sheet
- Modern, responsive UI with Material-UI components
- Interactive data visualization using Recharts
- Automatic data refresh every 30 seconds
- Error handling and loading states
- Dark mode support

## Prerequisites

- Python 3.8+
- Node.js 16+
- A public Google Spreadsheet with data

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `SPREADSHEET_ID` with your Google Sheet ID
   - Update other variables as needed

5. Run the backend server:
   ```bash
   uvicorn dashboard.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. The dashboard will automatically fetch and display data from your Google Sheet
3. Data refreshes every 30 seconds, or you can manually refresh using the refresh button
4. The dashboard displays:
   - Total number of records
   - Last update time
   - Data status
   - Interactive line chart visualization

## Project Structure

```
real-time-dashboard/
├── backend/
│   ├── dashboard/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 