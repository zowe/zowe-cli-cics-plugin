#!/bin/bash
set -e

echo "===============cics PROFILE HELP==============="

bright cics get resource --help
if [ $? -gt 0 ]
then
    exit $?
fi