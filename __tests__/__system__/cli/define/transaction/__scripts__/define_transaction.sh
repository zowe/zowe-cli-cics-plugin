#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

transaction_name=$1
program_name=$2
csd_group=$3
region_name=$4

bright cics define transaction "$transaction_name" "$program_name" "$csd_group" --region-name "$region_name"
