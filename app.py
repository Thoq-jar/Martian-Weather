from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import requests
from dotenv import load_dotenv
from requests.exceptions import RequestException, Timeout

load_dotenv()

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    api_key = os.getenv('OPENWEATHER_API_KEY')
    weather = None

    if lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            weather = response.json()
        except (Timeout, RequestException) as e:
            print(f"Error fetching weather data: {e}")

    return render_template('index.html', weather=weather)

@app.route('/fetch/weather')
def fetch_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    api_key = os.getenv('OPENWEATHER_API_KEY')

    if not lat and not lon:
        return jsonify({"error": "lat and long are required."}), 400

    if not lat:
        return jsonify({"error": "lat is required."}), 400
    
    if not lon:
        return jsonify({"error": "lon is required"}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except Timeout:
        print("error: request timed out while fetching weather data.")
        return jsonify({"error": "Timed out while fetching weather data."}), 504
    except RequestException as e:
        print(f"error fetching weather data: {e}")
        return jsonify({"error": "failed to fetch weather data."}), 500

@app.route('/static/<path:path>')
def router_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)