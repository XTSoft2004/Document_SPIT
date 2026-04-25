#!/bin/bash

# 1. Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    # Export all variables from .env, handling potential spaces and quotes
    set -a
    source .env
    set +a
fi

# 2. Generate appsettings.json dynamically
# Values are taken directly from the environment (Render Env Vars or .env file)
# If a variable is missing, it will result in an empty string in the JSON
echo "Generating appsettings.json from environment..."
cat <<EOF > appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=${DB_SERVER};Initial Catalog=${DB_DATABASE};User ID=${DB_USER};Password=${DB_PASSWORD};TrustServerCertificate=True;MultipleActiveResultSets=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "${JWT_ISSUER}",
    "Audience": "${JWT_AUDIENCE}",
    "ExpireToken": 3,
    "ExpireRefreshToken": 7
  },
  "GoogleInfo": {
    "client_id": "${GOOGLE_CLIENT_ID}",
    "client_secret": "${GOOGLE_CLIENT_SECRET}",
    "refresh_token": "${GOOGLE_REFRESH_TOKEN}"
  },
  "AllowedHosts": "*",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://0.0.0.0:5000"
      }
    }
  }
}
EOF

echo "appsettings.json has been generated."

# 3. Start the application
echo "Starting Document_SPIT_BE..."
exec dotnet Document_SPIT_BE.dll "$@"
