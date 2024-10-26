from typing import Optional, Any, Dict

import requests
from flask import Blueprint, render_template, request, jsonify, Response
from requests.exceptions import RequestException, Timeout

from config import Config

# Blueprint
bp = Blueprint('main', __name__)


# Index route
@bp.route('/')
def index() -> str:
    return render_template('base.jinja2', weather=None)


# Fetch weather route
@bp.route('/fetch/weather')
def fetch_weather() -> tuple[Response, int]:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    # Check if latitude and longitude are provided
    if not lat and not lon:
        return jsonify({"error": "lat and lon are required."}), 400

    # Check if latitude is provided
    if not lat:
        return jsonify({"error": "lat is required."}), 400

    # Check if longitude is provided
    if not lon:
        return jsonify({"error": "lon is required"}), 400

    url: str = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={Config.OPENWEATHER_API_KEY}&units=imperial"


    try:
        response: requests.Response = requests.get(url, timeout=5)
        response.raise_for_status()
        data: Dict[str, Any] = response.json()
        return jsonify(data), 200
    except Timeout:
        print("error: request timed out while fetching weather data.")
        return jsonify({"error": "Timed out while fetching weather data."}), 504
    except RequestException as e:
        print(f"error fetching weather data: {e}")
        return jsonify({"error": "failed to fetch weather data."}), 500


# Fetch forecast route
@bp.route('/fetch/forecast')
def fetch_forecast() -> tuple[Response, int]:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    
    if not lat or not lon:
        return jsonify({"error": "lat and lon are required."}), 400

    url: str = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/New_York"

    # Fetch forecast data
    try:
        response: requests.Response = requests.get(url, timeout=5)
        response.raise_for_status()
        data: Dict[str, Any] = response.json()
        return jsonify(data), 200
    except Timeout:
        return jsonify({"error": "Timed out while fetching weather data."}), 504
    except RequestException as e:
        return jsonify({"error": "failed to fetch weather data."}), 500
