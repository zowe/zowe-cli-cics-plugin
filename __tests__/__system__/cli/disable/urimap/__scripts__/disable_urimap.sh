#!/usr/bin/env bash
set -e

urimap_name=$1
region_name=$2
zowe cics disable urimap "$urimap_name" --region-name "$region_name"
