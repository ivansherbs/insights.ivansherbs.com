#!/usr/bin/env bash

set -e

function generate_redirects {
  echo '# Content custom URLs' > _site/_redirects

  grep --recursive --line-number --include '*.md' --binary-file=without-match --regexp '^url:' content | while read -r redirect_config
  do
    redirect_to=$(echo "${redirect_config}" | cut -d ':' -f 1 | sed 's/^content//' | sed 's/\.md$//')
    redirect_from=$(echo "${redirect_config}" | cut -d ':' -f 4 | sed 's/^ *//')

    echo "${redirect_from} ${redirect_to} 200" >> _site/_redirects
  done
}

function collect_contentful_images {
  # grep for all contentful images
  id_list=$(grep -r -E '\[\[\s*contentfulImage\s+\w+' --no-filename --binary-file=without-match content | cut -d ']' -f 1 | awk '{ print $2 }' | sed -e 's/$/,/g' | tr -d '\n')

  # finish here if no images
  if [ -z "${id_list}" ]
  then
    return
  fi

  if [ -z "${CONTENTFUL_ACCESS_TOKEN}" ]
  then
    >&2 echo "Missing value for environment variable value: CONTENTFUL_ACCESS_TOKEN"
    return 1
  fi

  # we need the directory for the contentful data
  mkdir -p content/_data/generated/contentful

  # generate the contentful image list
  curl --silent --globoff "https://cdn.contentful.com/spaces/lyvtxhzy9zgr/environments/master/assets?access_token=${CONTENTFUL_ACCESS_TOKEN}&sys.id[in]=${id_list}&select=fields.file,sys.id" | jq 'reduce .items[] as $asset ({}; .[$asset.sys.id] = "https:" + $asset.fields.file.url)' > content/_data/generated/contentful/images.json

  cat content/_data/generated/contentful/images.json | grep "https"
}

function pre_render_fragments {
  echo "IVAN: Copying _data directory to fragment directory ..."
  cp -r content/_data content/nl/fragments/

  echo "IVAN: Pre-processing template fragments ..."
  npx eleventy --input content/nl/fragments --output _site/nl/fragments

  echo "IVAN: Removing _data directory from fragment directory ..."
  rm -r content/nl/fragments/_data
}

function main {
  # page images
  echo "IVAN: Collecting Contentful images ..."
  collect_contentful_images
  if [ $? -gt 0 ]
  then
    >&2 echo "IVAN: Failed to collect Contentful images"
    return 1
  fi

  # template pre-rendering
  echo "IVAN: Pre-processing template fragments ..."
  pre_render_fragments
  if [ $? -gt 0 ]
  then
    >&2 echo "IVAN: Failed to pre-render template fragments"
    return 2
  fi

  # template rendering
  echo "IVAN: Processing templates ..."
  npx eleventy

  # generate redirects
  echo "IVAN: Generating redirects ..."
  generate_redirects
}

main $@
