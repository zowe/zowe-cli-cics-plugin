#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

transaction_name=$1
region_name=$2

bright cics discard transaction "$transaction_name" --region-name "$region_name"
