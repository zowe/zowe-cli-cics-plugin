#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
pipeline_name=$5
region_name=$6
enable=$7
tcpipservice=$8

zowe cics define urimap-pipeline "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --pipeline-name "$pipeline_name" --region-name "$region_name" --enable "$enable" --tcpipservice "$tcpipservice"
