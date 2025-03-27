from typing import Optional, Any, Dict, List

import requests
from flask import Blueprint, render_template, request, jsonify, Response
from requests.exceptions import RequestException, Timeout

from src.config import Config

# Blueprint
bp = Blueprint('main', __name__)

# Template filters
@bp.app_template_filter('datetime_format')
def datetime_format(value):
    """Format a date string to a more readable format."""
    from datetime import datetime
    date_obj = datetime.strptime(value, '%Y-%m-%d')
    return date_obj.strftime('%A, %b %d')


# Index route
@bp.route('/')
def index() -> str:
    return render_template('base.jinja2')


# Weather route with location
@bp.route('/weather')
def weather() -> str:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    # Check if latitude and longitude are provided
    if not lat or not lon:
        return render_template('weather_result.jinja2', error="Location data is required")

    # Get city name
    city_name = get_city_name(lat, lon)

    # Get weather data
    weather_data = get_weather_data(lat, lon)
    if isinstance(weather_data, str):
        return render_template('weather_result.jinja2', error=weather_data)

    # Get forecast data
    forecast_data = get_forecast_data(lat, lon)
    if isinstance(forecast_data, str):
        return render_template('weather_result.jinja2', 
                              city=city_name,
                              weather=weather_data,
                              error_forecast=forecast_data)

    # Render the weather result template with all data
    return render_template('weather_result.jinja2', 
                          city=city_name,
                          weather=weather_data,
                          forecast=forecast_data)


# Forecast fragment route
@bp.route('/forecast')
def forecast() -> str:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    # Check if latitude and longitude are provided
    if not lat or not lon:
        return render_template('forecast.jinja2', error="Location data is required")

    # Get forecast data
    forecast_data = get_forecast_data(lat, lon)
    if isinstance(forecast_data, str):
        return render_template('forecast.jinja2', error=forecast_data)

    # Render the forecast template with data
    return render_template('forecast.jinja2', forecast=forecast_data)


# Chart fragment route
@bp.route('/chart')
def chart() -> str:
    lat: Optional[str] = request.args.get('lat')
    lon: Optional[str] = request.args.get('lon')

    # Check if latitude and longitude are provided
    if not lat or not lon:
        return render_template('data_container.jinja2', error="Location data is required")

    # Get weather data
    weather_data = get_weather_data(lat, lon)
    if isinstance(weather_data, str):
        return render_template('data_container.jinja2', error=weather_data)

    # Render the chart template with data
    return render_template('data_container.jinja2', weather=weather_data)


# Helper function to get city name from coordinates
def get_city_name(lat: str, lon: str) -> str:
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        return (data.get('address', {}).get('city') or 
                data.get('address', {}).get('town') or 
                data.get('address', {}).get('village') or 
                data.get('address', {}).get('hamlet') or 
                "Unknown location")
    except Exception as e:
        print(f"Error fetching city name: {e}")
        return "Unknown location"


# Helper function to get weather data
def get_weather_data(lat: str, lon: str) -> Dict[str, Any] or str:
    url: str = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={Config.OPENWEATHER_API_KEY}&units=imperial"

    try:
        response: requests.Response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Timeout:
        print("error: request timed out while fetching weather data.")
        return "Timed out while fetching weather data."
    except RequestException as e:
        print(f"error fetching weather data: {e}")
        return "Failed to fetch weather data."


# Helper function to get forecast data
def get_forecast_data(lat: str, lon: str) -> Dict[str, Any] or str:
    url: str = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/New_York"

    try:
        response: requests.Response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        # Process the forecast data
        processed_data = []
        days = data['daily']['time']
        max_temps = data['daily']['temperature_2m_max']
        min_temps = data['daily']['temperature_2m_min']
        weather_codes = data['daily']['weathercode']

        for i in range(len(days)):
            # Convert Celsius to Fahrenheit
            max_temp_f = (max_temps[i] * 9) / 5 + 32
            min_temp_f = (min_temps[i] * 9) / 5 + 32

            processed_data.append({
                'date': days[i],
                'max_temp': max_temp_f,
                'min_temp': min_temp_f,
                'weather_code': weather_codes[i],
                'weather_description': get_weather_description(weather_codes[i])
            })

        return processed_data
    except Timeout:
        return "Timed out while fetching forecast data."
    except RequestException as e:
        return f"Failed to fetch forecast data: {e}"


# Helper function to get weather description from code
def get_weather_description(code: int) -> str:
    weather_codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Slight thunderstorm",
        96: "Moderate thunderstorm",
        99: "Severe thunderstorm",
    }
    return weather_codes.get(code, "Unknown condition")
