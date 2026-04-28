#!/bin/bash

# 1. Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    set -a
    source .env
    set +a
fi

# 2. Generate appsettings.json dynamically
echo "Generating appsettings.json from environment..."
cat <<EOF > appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=${DB_SERVER};Initial Catalog=${DB_DATABASE};User ID=${DB_USER};Password=${DB_PASSWORD};TrustServerCertificate=True;MultipleActiveResultSets=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "JwtSettings": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "${JWT_ISSUER}",
    "Audience": "${JWT_AUDIENCE}",
    "ExpireMinutes": ${JWT_EXPIRE_MINUTES:-60},
    "ExpireToken": ${JWT_EXPIRE_TOKEN:-3},
    "ExpireRefreshToken": ${JWT_EXPIRE_REFRESH_TOKEN:-7}
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
        "Url": "http://0.0.0.0:${PORT:-10000}"
      }
    }
  }
}
EOF

echo "appsettings.json generated successfully."

# 3. Start the application
echo "Starting Document_SPIT_BE..."
exec dotnet Document_SPIT_BE.dll "$@"
