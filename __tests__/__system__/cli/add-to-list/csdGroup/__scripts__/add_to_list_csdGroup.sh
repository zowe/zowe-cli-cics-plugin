#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

csd_group=$1
list_name=$2
region_name=$3

zowe cics add-to-list csdGroup "$csd_group" "$list_name" --region-name "$region_name"
