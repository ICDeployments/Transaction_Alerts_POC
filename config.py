"""
Configuration management for the Fraud Advisory System.
Uses pydantic_settings to load environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Azure AI Search Configuration
    search_endpoint: str
    search_api_key: str
    search_index_name: str
    
    # Azure OpenAI Configuration
    azure_openai_endpoint: str
    azure_openai_api_key: str
    azure_openai_deployment_name: str
    azure_openai_api_version: str = "2024-12-01-preview"
    
    # Application Configuration
    app_title: str = "Fraud Advisory Orchestrator"
    app_version: str = "1.0.0"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


# Global settings instance
settings = Settings()
