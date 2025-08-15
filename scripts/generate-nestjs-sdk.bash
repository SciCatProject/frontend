#!/bin/bash
#

# This default is for when developing with a backend running directly on localhost
SWAGGER_API_URL="http://localhost:3000/explorer-json"
while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--swagger-url)
			shift
			SWAGGER_API_URL=$1
			shift
			;;
		*)
			echo "Unknown argument: $1"
			exit 1
			;;
	esac
done

USER=`who am i | cut -d\  -f1`
echo -e "\nUser running the script: ${USER}"

echo -e "\nCleanup old files..."
rm -rf node_modules/@scicatproject/scicat-sdk-ts-angular
rm -rf @scicatproject/scicat-sdk-ts-angular
rm local-api-for-generator.json

echo -e "\nFetching the Swagger API from the back end..."
curl ${SWAGGER_API_URL} > local-api-for-generator.json

echo -e "\nGenerating the new sdk..."

##
# NOTE: parameter --skip-validate-spec is passed to avoid some errors like not supporting the "content" in the @ApiQuery() parameter that we use in the dataset v4 controller.
# This should not be a risk as after the generation we can get a feedback immediately if something is broken here when we run and test the frontend.
##
docker run \
	--rm \
	-v "`pwd`:/local" \
	openapitools/openapi-generator-cli:v7.14.0 generate \
	-i /local/local-api-for-generator.json \
	-g typescript-angular \
	-o local/@scicatproject/scicat-sdk-ts-angular \
	--additional-properties=ngVersion=19.0.0,npmName=@scicatproject/scicat-sdk-ts-angular,supportsES6=true,withInterfaces=true  --skip-validate-spec

rm local-api-for-generator.json

# Check if the docker command resulted in any output.
# If we don't do this, we'll try to cd into a missing folder,
# and then we'd be invoking 'npm run build' as root in the main project folder,
# which would create a bunch of stuff in ./dist belonging to root,
# causing problems for things like SciCat Live.
if [ ! -d "@scicatproject/scicat-sdk-ts-angular" ]; then
  echo "Error: OpenApi output not found."
  exit 1
fi

REMOVE_NPM_LINK=0
if ! command -v npm 2>&1 1>/dev/null
then
	if [ "--`env | grep NVM_BIN`--" != "----" ]
	then
		echo -e "\nCreating links to npm and node versions"
		ln -s "$NVM_BIN/npm" "/usr/local/bin/npm"
		whereis npm
		ln -s "$NVM_BIN/node" "/usr/local/bin/node"
		whereis node
		REMOVE_NPM_LINK=1
	else
		echo -e "\nNo npm found!!!"
		exit 1
	fi
fi

echo -e "\nInstalling dependencies and building the sdk..."
cd @scicatproject/scicat-sdk-ts-angular 
npm install
npm run build

echo -e "\nCopying the build files in node_modules..."
cd ../..
cp -rv @scicatproject/scicat-sdk-ts-angular/dist node_modules/@scicatproject/scicat-sdk-ts-angular

echo -e "\nAdjusting ownership to user ${USER}"
chown -Rv ${USER} node_modules/@scicatproject/scicat-sdk-ts-angular

echo -e "\nFinal cleanup..."
echo -e "Removing sdk folder"
rm -rfv @scicatproject

if [ $REMOVE_NPM_LINK -eq 1 ];
then
	echo -e "\nRemoving links to npm and node"
	rm -fv "/usr/local/bin/npm"
	rm -fv "/usr/local/bin/node"
fi
