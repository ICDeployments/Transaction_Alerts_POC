# Transaction_Alerts_POC

A proof-of-concept fraud advisory orchestrator using FastAPI, Azure Search, and Azure OpenAI.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in Azure Search and Azure OpenAI credentials.
3. Run the application with the environment variables loaded.

## Security

- Do not commit `.env`.
- Azure secrets must be provided via environment variables, not hardcoded in source.
