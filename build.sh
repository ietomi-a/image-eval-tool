FRONT_DIR=front
SERVER_DIR=server

cd $SERVER_DIR; python build.py; cd ..
cd $FRONT_DIR; npm run build; cd ..
mkdir -p $SERVER_DIR/build
cp -r $FRONT_DIR/out $SERVER_DIR/build/
cp $FRONT_DIR/static/* $SERVER_DIR/build/
