#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

csd_group=$1
list_name=$2
region_name=$3
HOST=$4
PORT=$5
USER=$6
PASSWORD=$7
PROTOCOL=$8
REJECT="$9"
zowe cics remove-from-list csdGroup "$csd_group" "$list_name" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
