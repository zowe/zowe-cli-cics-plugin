#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
urimap_scheme=$5
program_name=$6
region_name=$7
HOST=$8
PORT=$9
USER=${10}
PASSWORD=${11}
PROTOCOL=${12}
REJECT=${13}
zowe cics define urimap-server "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --urimap-scheme "$urimap_scheme" --program-name "$program_name" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
