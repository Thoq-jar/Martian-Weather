from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import requests
from dotenv import load_dotenv
from requests.exceptions import RequestException, Timeout

load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__, template_folder='templates')

    try:
        os.makedirs(app.instance_path)
    except OSError:
        print("warn: could not create instance folder!")
        pass

    @app.route('/')
    def index():
        return render_template('base.html', weather=None)

    @app.route('/static/<path:path>')
    def router_static(path):
        return send_from_directory('static', path)

    @app.route('/static/css/<path:path>')
    def router_css(path):
        return send_from_directory('static/css', path + '.css')

    @app.route('/static/js/<path:path>')
    def router_js(path):
        return send_from_directory('static/js', path + '.js')

    @app.route('/static/img/<path:path>')
    def router_img(path):
        return send_from_directory('static/img', path)

    @app.route('/fetch/weather')
    def fetch_weather():
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        api_key = os.getenv('OPENWEATHER_API_KEY')

        if not lat and not lon:
            return jsonify({"error": "lat and lon are required."}), 400

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

    @app.route('/fetch/forecast')
    def fetch_forecast():
        lat = request.args.get('lat')
        lon = request.args.get('lon')

        if not lat or not lon:
            return jsonify({"error": "lat and lon are required."}), 400

        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/New_York"

        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            return jsonify(data)
        except Timeout:
            return jsonify({"error": "Timed out while fetching weather data."}), 504
        except RequestException as e:
            return jsonify({"error": "failed to fetch weather data."}), 500

    return app
