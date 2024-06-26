version="1.0.0-SNAPSHOT"

echo "Publishing v$version"

echo "Removing old dist"
rm -rf ./dist

echo "Building"
npm run build

echo "Removing old images"
docker image remove -f todoroff318/testfr:testfr

echo "Building new images"
docker build -t todoroff318/testfr:testfr .

echo "Publish to Dockerhub"
docker push todoroff318/testfr:testfr

echo "Publishing v$version completed!"
