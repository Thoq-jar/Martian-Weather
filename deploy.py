#!/usr/bin/env python3

import os

def main():
    print("Welcome!")


    name = input("Deployment name (martian-weather): ")

    if name == "":
        name = "martian-weather"

    api_key = input("Enter your OpenWeather API key (openweathermap.org/api): ")

    print("Login to GCP:")
    os.system("gcloud auth")

    project_id = input("Enter project id: ")
    os.system(f"gcloud config set project {project_id}")

    print("Submitting build...")
    os.system(f"gcloud builds submit --tag gcr.io/{project_id}/{name}")

    print("Deploying...")
    os.system(f"gcloud run deploy {name} --image gcr.io/{project_id}/{name} --set-env-vars OPENWEATHER_API_KEY={api_key} --platform managed --region us-central1 --allow-unauthenticated")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting...")
