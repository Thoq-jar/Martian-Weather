# Martian-Weather
> A "Modern" Weather App

# Deploying
### GCP
```bash
gcloud auth login
gcloud config set project {YOUR_PROJECT_ID}
gcloud builds submit --tag gcr.io/{YOUR_PROJECT_ID}/martian-weather
gcloud run deploy martian-weather \
    --image gcr.io/{YOUR_PROJECT_ID}/martian-weather \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars OPENWEATHER_API_KEY={YOUR_API_KEY}
```

# License
[MIT](LICENSE.txt)