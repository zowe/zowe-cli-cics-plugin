#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

transaction_name=$1
csd_group=$2
region_name=$3

zowe cics install transaction "$transaction_name" "$csd_group" --region-name "$region_name"
