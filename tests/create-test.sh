#!/bin/bash
set -euo pipefail

if [ -z "$1" ]
then
    exit
fi

COMPONENT_NAME=$1
TEST_FILE=./$COMPONENT_NAME.test.js

cp /e/Programming/praca/plc-simulator/plc-simulator/test/template.test.js "$TEST_FILE"

echo "$(sed s/__COMPONENT_NAME__/$COMPONENT_NAME/g $TEST_FILE)" > "$TEST_FILE"