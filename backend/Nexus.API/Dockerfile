# Stage 1: Build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files first for layer caching
COPY ["Nexus.API/Nexus.API.csproj",           "Nexus.API/"]
COPY ["Nexus.Infrastructure/Nexus.Infrastructure.csproj", "Nexus.Infrastructure/"]
COPY ["Nexus.Contracts/Nexus.Contracts.csproj", "Nexus.Contracts/"]
COPY ["Nexus.Domain/Nexus.Domain.csproj",     "Nexus.Domain/"]

RUN dotnet restore "Nexus.API/Nexus.API.csproj"

# Copy source code and publish
COPY . .
WORKDIR /src/Nexus.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime — small image, no SDK
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Azure App Service Linux expects port 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Nexus.API.dll"]