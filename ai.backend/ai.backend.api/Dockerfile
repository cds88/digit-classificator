FROM mcr.microsoft.com/dotnet/sdk:8.0  


WORKDIR /app

COPY . ./

EXPOSE 5013

CMD ["dotnet", "watch", "run", "--non-interactive", "--project", "ai.backend.api/ai.backend.api.csproj", "--urls", "http://0.0.0.0:5013"]


