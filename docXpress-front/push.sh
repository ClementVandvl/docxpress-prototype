#!/bin/bash

# Define variables
USER="quentin"
HOST="quentin-desmettre.fr"
DIRECTORY="docXpress-front"
IMAGE_NAME="docxpress-front"
DOCKERFILE="prod.Dockerfile"
PORT=1234

# Connect to SSH, cd to the directory, and pull the latest changes
ssh $USER@$HOST << EOF
    cd $DIRECTORY
    git pull
    docker stop $IMAGE_NAME
    docker rm $IMAGE_NAME
    docker build -t $IMAGE_NAME -f $DOCKERFILE .
    docker run -d -p $PORT:$PORT --name $IMAGE_NAME $IMAGE_NAME
EOF

echo "Deployment completed successfully."