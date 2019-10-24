#!/usr/bin/env bash
set -e

urimap_name=$1
csd_group=$2
region_name=$3
zowe cics delete urimap "$urimap_name" "$csd_group" --region-name "$region_name"
