#!/usr/bin/env bash

function cleanup {
  rm -rf _site
  rm -rf content/_data/contentful/images.json
}

function build {
  ./build.sh
  if [ $? -gt 0 ]
  then
    >&2 echo "IVAN: Build failed"
    return 1
  fi
}

function log_generated_data {
  if [ -f "content/_data/contentful/images.json" ]
  then
    echo "IVAN: Found Contentful image file:"
    cat "content/_data/contentful/images.json" | sed 's/^/> /'
  fi

  if [ -f "_site/_redirects" ]
  then
    echo "IVAN: Found _redirects file:"
    cat "_site/_redirects" | sed 's/^/> /'
  fi
}

function main {
  cleanup
  if [ $? -gt 0 ]
  then
    return 1
  fi

  build
  if [ $? -gt 0 ]
  then
    return 2
  fi

  log_generated_data
  if [ $? -gt 0 ]
  then
    return 3
  fi

  # serve the content
  npx eleventy --serve --watch --quiet
  if [ $? -gt 0 ]
  then
    return 4
  fi
}

main $@
