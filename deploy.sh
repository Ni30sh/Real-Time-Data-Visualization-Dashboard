#!/bin/bash

# Create .env file for frontend
echo "Creating frontend .env file..."
cat > frontend/.env << EOL
VITE_API_URL=http://localhost:8000
VITE_PRODUCTION_API_URL=https://real-time-dashboard-backend.onrender.com
EOL

# Create .env file for backend
echo "Creating backend .env file..."
cat > backend/.env << EOL
SPREADSHEET_ID=1L2rmaklLE-NFDdGNbQqkiHnJPCe08qguo2tEOX5oaNY
RANGE_NAME=Sheet1!A:K
EOL

echo "Deployment files created successfully!"
echo "Please deploy to Render and Vercel" 