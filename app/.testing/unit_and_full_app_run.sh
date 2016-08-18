#!/bin/bash

mkdir .coverage

meteor npm run test
UNIT_RESULT=$?

meteor npm run test-app
FULL_APP_RESULT=$?

if [[ "$UNIT_RESULT" -eq 0 && "$FULL_APP_RESULT" -eq 0 ]]
then
  echo "Both tests pass!"
else
  echo "One of the tests failed!" >&2
fi
