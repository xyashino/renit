FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["RentIt.Server/RentIt.Server.csproj", "RentIt.Server/"]

RUN dotnet restore "RentIt.Server/RentIt.Server.csproj"

COPY . .

WORKDIR "/src/RentIt.Server"
RUN dotnet build "RentIt.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/RentIt.Server"
RUN dotnet publish "RentIt.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RentIt.Server.dll"]
