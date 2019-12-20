#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

urimap_name=$1
csd_group=$2
urimap_path=$3
urimap_host=$4
region_name=$5
enable=$6
authenticate=$7
certificate=$8

zowe cics define urimap-client "$urimap_name" "$csd_group" --urimap-path "$urimap_path" --urimap-host "$urimap_host" --region-name "$region_name" --enable "$enable" --authenticate "$authenticate" --certificate "$certificate"
