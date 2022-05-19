SERVER_DIR=server
# cd $SERVER_DIR; uvicorn app:app --workers 1  --reload --port 8080
cd $SERVER_DIR; python app.py
