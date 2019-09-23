#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
urimap_scheme=$5
pipeline_name=$6
region_name=$7
HOST=$8
PORT=$9
USER=${10}
PASSWORD=${11}
PROTOCOL=${12}
REJECT=${13}
zowe cics define urimap-pipeline "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --urimap-scheme "$urimap_scheme" --pipeline-name "$pipeline_name" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
