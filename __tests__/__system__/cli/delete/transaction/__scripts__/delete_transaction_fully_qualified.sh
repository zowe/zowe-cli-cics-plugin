#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

transaction_name=$1
csd_group=$2
region_name=$3
HOST=$4
PORT=$5
USER=$6
PASSWORD=$7

zowe cics delete transaction "$transaction_name" "$csd_group" --region-name "$region_name" --host $HOST --port $PORT --user $USER --password $PASSWORD
