#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
urimap_scheme=$5
region_name=$6
HOST=$7
PORT=$8
USER=$9
PASSWORD=${10}
PROTOCOL=${11}
REJECT=${12}
zowe cics define urimap-client "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --urimap-scheme "$urimap_scheme" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
