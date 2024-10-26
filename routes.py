from typing import Optional, Any, Dict

import requests
from flask import Blueprint, render_template, request, jsonify, Response
from requests.exceptions import RequestException, Timeout

from config import Config

bp = Blueprint('main', __name__)


@bp.route('/')
def index() -> str:
    return render_template('base.jinja2', weather=None)


@bp.route('/fetch/weather')
def fetch_weather() -> tuple[Response, int]:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    if not lat and not lon:
        return jsonify({"error": "lat and lon are required."}), 400

    if not lat:
        return jsonify({"error": "lat is required."}), 400

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


@bp.route('/fetch/forecast')
def fetch_forecast() -> tuple[Response, int]:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "lat and lon are required."}), 400

    url: str = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/New_York"

    try:
        response: requests.Response = requests.get(url, timeout=5)
        response.raise_for_status()
        data: Dict[str, Any] = response.json()
        return jsonify(data), 200
    except Timeout:
        return jsonify({"error": "Timed out while fetching weather data."}), 504
    except RequestException as e:
        return jsonify({"error": "failed to fetch weather data."}), 500
