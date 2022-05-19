FRONT_DIR=front
SERVER_DIR=server

cd $FRONT_DIR; npm install; cd ..
cd $SERVER_DIR; pip install -r requirements.txt; cd ..
