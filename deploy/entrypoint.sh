#! /bin/sh
# exit script when any command ran here returns with non-zero exit code
set -e

replace () {
  if [ -z "$2" ];
  then
    echo "[WARN] Missing Environment Variable for $1"
  else 
    echo "Setting $1 to $2"

    SEARCH=$1
    REPLACE=$2
    sed -i "s|${SEARCH}|${REPLACE}|g" /usr/share/nginx/html/*.js
  fi
}

replace "%%ACCOUNTS_URI%%" $ACCOUNTS_URI
replace "%%AUTH_URI%%" $AUTH_URI
replace "%%REALM%%" $REALM
replace "%%CLIENT_URI%%" $CLIENT_URI
replace "%%API%%" $API

echo "Starting nginx..."
nginx -g "daemon off;"