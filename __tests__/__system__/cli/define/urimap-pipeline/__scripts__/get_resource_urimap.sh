#!/usr/bin/env bash
set -e # fail the script if we get a non zero exit code

region_name=$1
csd_group=$2

zowe cics get resource CICSDefinitionURIMap --region-name "$region_name" --parameter "CSDGROUP($csd_group)"
