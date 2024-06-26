#!/bin/bash

COMPOSE_FILE="./docker-compose.yml"

declare -A services
services["frontend"]="todoroff318/testfr"
services["backend"]="todoroff318/test"

get_latest_tag() {
    JSON=$(curl -s "https://registry.hub.docker.com/v2/repositories/$1/tags/")
    echo $(echo "$JSON" | jq -r '.results | sort_by(.name | capture("^(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)$")) | last | .name')
}

 get_current_tag() {
     TAG=$(docker-compose -f $COMPOSE_FILE config | grep "image: $1" | awk -F':' '{print $3}')
     if [ -z "$TAG" ]; then
         echo "No current tag found for $1 in the Docker Compose file"
         return 1
     fi
     echo $TAG
 }


# update services if newer version
for service in "${!services[@]}"
do
    REPO=${services[$service]}
    CURRENT_TAG=$(get_current_tag $REPO)
    if [ $? -ne 0 ]; then
        continue
    fi

    LATEST_TAG=$(get_latest_tag $REPO)
    if [ $? -ne 0 ]; then
        continue
    fi

    echo "Current tag for $service: $CURRENT_TAG"
    echo "Latest tag for $service: $LATEST_TAG"

    if [ "$LATEST_TAG" != "$CURRENT_TAG" ]; then
        echo "Newer version detected for $service. Updating to $LATEST_TAG..."
        sed -i "s|${REPO}:${CURRENT_TAG}|${REPO}:${LATEST_TAG}|g" $COMPOSE_FILE
        docker-compose -f $COMPOSE_FILE pull $service
        docker-compose -f $COMPOSE_FILE up -d $service
    else
        echo "No updates found for $service."
    fi
done
