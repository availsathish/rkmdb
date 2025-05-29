# Customer and Product Database Management Application

## Overview
This repository contains the complete source code for a customer and product database management application. The application is built with a Flask backend API and a React frontend.

## Structure
- `backend/` - Flask backend API
  - `src/` - Source code for the Flask application
    - `models/` - Database models
    - `routes/` - API endpoints
    - `static/` - Static files and React build
  - `requirements.txt` - Python dependencies

- `frontend/` - React frontend
  - `src/` - Source code for the React application
    - `components/` - Reusable UI components
    - `pages/` - Page components
    - `services/` - API service for backend communication
  - `package.json` - Node.js dependencies
  - `tsconfig.json` - TypeScript configuration

## Backend Setup
1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python -m src.main
   ```

## Frontend Setup
1. Install dependencies:
   ```
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Build for production:
   ```
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

## Features
- Customer management (add, edit, view, delete)
- Product management (add, edit, view, delete)
- Product image upload and display
- Responsive design for all devices

## Technologies Used
- Backend:
  - Flask
  - SQLAlchemy
  - SQLite
  - Flask-CORS

- Frontend:
  - React
  - TypeScript
  - Material UI
  - React Router
  - Axios

## Deployment
The application can be deployed as a full-stack application with the React frontend served by the Flask backend.

## License
This project is provided for your use without any warranty. You are free to modify and distribute it as needed.
