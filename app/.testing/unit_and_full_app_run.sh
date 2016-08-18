#!/bin/bash

mkdir .coverage

meteor npm run test
UNIT_RESULT=$?

meteor npm run test-app
FULL_APP_RESULT=$?

if [[ "$UNIT_RESULT" -eq 0 && "$FULL_APP_RESULT" -eq 0 ]]
then
  echo "Both tests pass!"
  exit 0
elif [[ "$UNIT_RESULT" -ne 0 && "$FULL_APP_RESULT" -ne 0 ]]
then
  echo "Both tests failed!"
  exit ${UNIT_RESULT}
elif [[ "$UNIT_RESULT" -ne 0 ]]
then
  echo "Unit tests failed!"
  exit ${UNIT_RESULT}
elif [[ "$FULL_APP_RESULT" -ne 0 ]]
then
  echo "Full-app tests failed!"
  exit ${FULL_APP_RESULT}
fi
