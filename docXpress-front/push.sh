#!/bin/bash

# Define variables
USER="quentin"
HOST="quentin-desmettre.fr"
DIRECTORY="docXpress-front"
IMAGE_NAME="docxpress-front"
DOCKERFILE="prod.Dockerfile"
PORT=1234

mv node_modules dist /tmp
scp -r * $USER@$HOST:/home/quentin/$DIRECTORY
mv /tmp/node_modules /tmp/dist .
ssh $USER@$HOST << EOF
    cd $DIRECTORY
    docker stop $IMAGE_NAME
    docker rm $IMAGE_NAME
    docker build -t $IMAGE_NAME -f $DOCKERFILE .
    docker run -d -p $PORT:$PORT --name $IMAGE_NAME $IMAGE_NAME
EOF

echo "Deployment completed successfully."