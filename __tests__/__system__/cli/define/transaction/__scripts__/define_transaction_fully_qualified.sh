#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

transaction_name=$1
program_name=$2
csd_group=$3
region_name=$4
HOST=$5
PORT=$6
USER=$7
PASSWORD=$8
PROTOCOL=$9
REJECT="${10}"
zowe cics define transaction "$transaction_name" "$program_name" "$csd_group" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD --protocol "$PROTOCOL" --reject-unauthorized "$REJECT"
