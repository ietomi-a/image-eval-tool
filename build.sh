FRONT_DIR=front
SERVER_DIR=server

cd $FRONT_DIR; npm run build; cd ..
mkdir -p $SERVER_DIR/build/
cp $FRONT_DIR/index.html $SERVER_DIR/build/
mkdir -p $SERVER_DIR/build/out
cp -r $FRONT_DIR/out $SERVER_DIR/build/
cp $FRONT_DIR/tomato.ico $SERVER_DIR/build/out/
cp $FRONT_DIR/default.css $SERVER_DIR/build/out/


