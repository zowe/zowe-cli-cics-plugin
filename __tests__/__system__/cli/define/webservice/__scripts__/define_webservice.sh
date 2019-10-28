#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

websvc_name=$1
csd_group=$2
pipeline_name=$3
wsbind=$4
region_name=$5

zowe cics define webservice "$websvc_name" "$csd_group" --pipeline-name "$pipeline_name" --wsbind "$wsbind" --region-name "$region_name"
