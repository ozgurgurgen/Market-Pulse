#!/bin/bash
while true; do
  if ps -p $1 > /dev/null; then
    sleep 2
  else
    break
  fi
done
