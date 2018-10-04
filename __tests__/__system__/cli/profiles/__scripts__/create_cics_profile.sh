#! /bin/sh
set -e

echo "===============CREATE cics PROFILE==============="

bright profiles create cics-profile cics1 --host cics1 --port 1234 --user ibmuser --password pwrd1234
bright profiles delete cics-profile cics1 # delete the stored credentials