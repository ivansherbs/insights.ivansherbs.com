#!/usr/bin/env bash

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
  id_list=$(grep -r 'contentful.images' --no-filename --binary-file=without-match content | cut -d '.' -f 3 | cut -d ' ' -f 1 | sed -e 's/$/,/g' | tr -d '\n')

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
echo $id_list
  # we need the directory for the contentful data
  mkdir -p content/_data/contentful
echo 1
  # generate the contentful image list
  curl --silent "https://cdn.contentful.com/spaces/lyvtxhzy9zgr/environments/master/assets?access_token=${CONTENTFUL_ACCESS_TOKEN}&sys.id[in]=${id_list}&select=fields.file,sys.id" # | jq 'reduce .items[] as $asset ({}; .[$asset.sys.id] = "https:" + $asset.fields.file.url + "?fm=jpg&q=50&w=1080" )' > content/_data/contentful/images.json
echo 2
  ls -l content/_data/contentful/images.json
echo 3
  cat content/_data/contentful/images.json
echo 4
  cat content/_data/contentful/images.json | grep "https"
echo 5
}

function main {
  # page images
  echo "IVAN: Collecting contentful images ..."
  collect_contentful_images
  if [ $? -gt 0 ]
  then
    return 1
  fi

  # templates pre-rendering
  echo "IVAN: Pre-processing template fragments ..."
  npx eleventy --input content/nl/ivans/veelgestelde-vragen --output _site/nl/ivans/veelgestelde-vragen
  npx eleventy --input content/nl/ivans/voordelen --output _site/nl/ivans/voordelen

  # templates rendering
  echo "IVAN: Processing templates ..."
  npx eleventy

  # generate redirects
  echo "IVAN: Generating redirects ..."
  generate_redirects
}

main $@
