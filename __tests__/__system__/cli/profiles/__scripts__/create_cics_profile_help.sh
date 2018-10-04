#! /bin/sh
set -e

echo "===============CREATE cics PROFILE HELP==============="

bright profiles create cics-profile -h
if [ $? -gt 0 ]
then
    exit $?
fi