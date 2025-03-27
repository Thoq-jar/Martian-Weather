# Martian-Weather
> A "Modern" Weather App

## Overview
Martian-Weather is a weather application that displays current weather conditions and a 7-day forecast for the user's location. The application uses:

- **Flask**: A Python web framework for the backend
- **HTMX**: For "over the wire" updates without full page reloads
- **Chart.js**: For data visualization

## Architecture
The application follows a server-side rendering approach, where most of the logic is handled on the server and HTML fragments are sent to the client. This is similar to the approach used by Rails with Hotwire.

- **Server-side**: Python/Flask handles data fetching, processing, and rendering
- **Client-side**: Minimal JavaScript for geolocation and HTMX for dynamic updates

## Running Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/Martian-Weather.git
cd Martian-Weather

# Set up environment variables
export OPENWEATHER_API_KEY=your_api_key

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

# Deploying
### Self-Hosted
```bash
docker build -t martian-weather .
docker run -p 8000:8000 martian-weather
```

### GCP
```bash
gcloud auth login
gcloud config set project {YOUR_PROJECT_ID}
gcloud builds submit --tag gcr.io/{YOUR_PROJECT_ID}/martian-weather
gcloud run deploy martian-weather --image gcr.io/{YOUR_PROJECT_ID}/martian-weather --platform managed --region us-central1 --allow-unauthenticated --set-env-vars OPENWEATHER_API_KEY={YOUR_API_KEY}
```

# License
[MIT](LICENSE.txt)
