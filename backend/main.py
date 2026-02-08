import os
import uvicorn
from src.api.main import app


def main():
    print("Starting Todo API server...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False  # Set to True only in development
    )


if __name__ == "__main__":
    main()


# This allows the app to be imported by uvicorn when using "python -m uvicorn main:app"
# The app object is now available at the module level
