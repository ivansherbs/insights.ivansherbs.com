#!/usr/bin/env bash

./build.sh

if [ -f "_site/_redirects" ]
then
  echo "Found _redirects file:"
  cat "_site/_redirects" | sed 's/^/> /'
fi

# serve the content
npx eleventy --serve --watch --dryrun --quiet


