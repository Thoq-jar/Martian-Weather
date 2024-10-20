from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import requests
from dotenv import load_dotenv
from requests.exceptions import RequestException, Timeout

load_dotenv()

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html', weather=None)

@app.route('/fetch/weather')
def fetch_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    api_key = os.getenv('OPENWEATHER_API_KEY')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required."}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except Timeout:
        print("Error: Request timed out while fetching weather data.")
        return jsonify({"error": "Timed out while fetching weather data."}), 504
    except RequestException as e:
        print(f"Error fetching weather data: {e}")
        return jsonify({"error": "Failed to fetch weather data."}), 500
    
@app.route('/geolocation')
def geolocation():
    ip_info_url = "http://ip-api.com/json"
    try:
        response = requests.get(ip_info_url, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data['status'] == 'success':
            lat = data.get("lat")
            lon = data.get("lon")
            return jsonify({"lat": lat, "lon": lon})
        else:
            return jsonify({"error": "Location not found."}), 404
    except Timeout:
        print("Error: Request timed out while fetching location.")
        return jsonify({"error": "Timed out while fetching location."}), 504
    except RequestException as e:
        print(f"Error fetching location: {e}")
        return jsonify({"error": "Failed to get location."}), 500

@app.route('/static/<path:path>')
def router_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=False)