#!/bin/bash
set -e

echo "===============cics PROFILE HELP==============="

zowe cics get resource --help
if [ $? -gt 0 ]
then
    exit $?
fi