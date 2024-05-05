#  export NODE_OPTIONS=--openssl-legacy-provider && ./www/npm run start
# pkg
#
# dont run server if commandline noserver arg passed
# if [ "$1" != "noserve" ]; then
echo "Starting server"
python3 -m http.server -d ./dist/www 8080
# fi
