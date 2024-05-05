#!/usr/bin/env bash
wasm-pack build --target web

rm -rf ./dist/www
mkdir -p ./dist/www

mkdir -p ./dist/www/wasm
# copy except node_modules
rsync -av ./www/ ./dist/www --exclude node_modules --exclude .git --exclude .bin
cp -r ./pkg/* ./dist/www/wasm

# #  export NODE_OPTIONS=--openssl-legacy-provider && ./www/npm run start
# # pkg
# #
# # dont run server if commandline noserver arg passed
if [ "$1" != "noserve" ]; then
	echo "Starting server"
	python3 -m http.server -d ./dist/www 8080
fi
