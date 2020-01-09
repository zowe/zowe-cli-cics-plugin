#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
urimap_scheme=$5
program_name=$6
region_name=$7
enable=$8
tcpipservice=$9
HOST=${10}
PORT=${11}
USER=${12}
PASSWORD=${13}
PROTOCOL=${14}
REJECT=${15}
zowe cics define urimap-server "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --urimap-scheme "$urimap_scheme" --program-name "$program_name" --region-name "$region_name"  --enable "$enable" --tcpipservice "$tcpipservice" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
