#!/bin/bash

attempt=0

while [ $attempt -le 50 ]
do
  curl --connect-timeout 1 http://localhost:4000/healthcheck
  
  if [ $? -eq 0 ]
  then
    exit 0
  else
    ((attempt++))
    sleep 10
  fi
done

exit 1
