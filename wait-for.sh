#!/bin/bash
# wait-for.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -w 1 $host -z $port ; do
  sleep 1
done

echo "OK"
exec $cmd