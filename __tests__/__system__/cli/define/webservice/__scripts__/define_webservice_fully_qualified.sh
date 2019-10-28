#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

websvc_name=$1
csd_group=$2
pipeline_name=$3
wsbind=$4
region_name=$5
HOST=$6
PORT=$7
USER=$8
PASSWORD=$9
PROTOCOL=${10}
REJECT=${11}
zowe cics define webservice "$websvc_name" "$csd_group" --pipeline-name "$pipeline_name" --wsbind "$wsbind" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
