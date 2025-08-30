# --- Base image for runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5000

# --- Build image ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy main projects
COPY ["Document_SPIT/Document_SPIT_BE.csproj", "Document_SPIT/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["Domain/Domain.csproj", "Domain/"]

# Copy custom DLLs
COPY /DLL_Extension/ /src/DLL_Extension/

# Restore dependencies
RUN dotnet restore "Document_SPIT/Document_SPIT_BE.csproj"

# Copy full source code
COPY . .

# Optional: for dotnet watch support in dev
RUN apt-get update && apt-get install -y inotify-tools

# Build
WORKDIR "/src/Document_SPIT"
RUN dotnet build "Document_SPIT_BE.csproj" -c $BUILD_CONFIGURATION -o /app/build

# --- Publish stage ---
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Document_SPIT_BE.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# --- Development environment: dotnet watch ---
# --- Development environment: dotnet watch ---
FROM build AS dev
WORKDIR /src

ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=true 

CMD ["dotnet", "watch", "--project", "Document_SPIT/Document_SPIT_BE.csproj", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:5000"]
# --- Final production image ---
FROM base AS final
WORKDIR /app

# Copy publish output
COPY --from=publish /app/publish .

# Copy optional appsettings if needed
COPY Document_SPIT/appsettings.json ./appsettings.json

# Copy .env into container
COPY .env .env

ENV DOTNET_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Document_SPIT_BE.dll"]
