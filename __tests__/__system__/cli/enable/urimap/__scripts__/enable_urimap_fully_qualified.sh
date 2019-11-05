#!/usr/bin/env bash
set -e

urimap_name=$1
region_name=$2
HOST=$3
PORT=$4
USER=$5
PASSWORD=$6
PROTOCOL=$7
REJECT=$8
zowe cics enable urimap "$urimap_name" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
