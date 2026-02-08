import uvicorn
from src.api.main import app


def main():
    print("Starting Todo API server...")
    uvicorn.run(
        "src.api.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False  # Set to True only in development
    )


if __name__ == "__main__":
    import os
    main()
