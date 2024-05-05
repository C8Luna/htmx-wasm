#!/usr/bin/env bash
python3 -m http.server -d ./dist/www 8080 &
cargo watch -s './build.sh noserve'
