#!/bin/bash

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -w 1 $host -z $port ; do
  >&2 echo "minio is unavailable - sleeping"
  sleep 1
done

echo "minio is available - running"
exec $cmd