#!/usr/bin/env bash

IMAGE_DIR=content/_data/generated/contentful

function collect_sorted_unique_inline_image_ids {
  grep -r -E '\[\[\s*contentfulImage\s+\w+' --no-filename --binary-file=without-match content | cut -d ']' -f 1 | awk '{ print $2 }' | sort -u
}

function collect_sorted_unique_banner_image_ids {
  grep -r -A2 -E '^banner:' --no-filename --binary-file=without-match content | grep 'image:' | awk '{ print $2 }' | sort -u
}

function collect_sorted_generated_image_ids {
  grep "https" "${IMAGE_DIR}/$1.json" | cut -d '"' -f 2 | sort
}

function generate_contenful_image_cache_file {

  collection_type=$1

  # grep for the required Contentful images
  if [ "${collection_type}" == "inline" ]
  then
    echo "Collecting ${collection_type} Contentful images"
    id_list=$(collect_sorted_unique_inline_image_ids)
  elif [ "${collection_type}" == "banner" ]
  then
    echo "Collecting ${collection_type} Contentful images"
    id_list=$(collect_sorted_unique_banner_image_ids)
  else
    >&2 echo "Invalid Contentful image collection type: ${collection_type}"
    return 1
  fi

  id_comma_list=$(echo ${id_list} | sed -e 's/ /,/g' | tr -d '\n')

  # finish here if no images
  if [ -z "${id_comma_list}" ]
  then
    return
  fi

  if [ -z "${CONTENTFUL_ACCESS_TOKEN}" ]
  then
    >&2 echo "Missing value for environment variable value: CONTENTFUL_ACCESS_TOKEN"
    return 2
  fi

  # we need the directory for the Contentful data
  mkdir -p "${IMAGE_DIR}"
  image_file_path=${IMAGE_DIR}/${collection_type}.json

  contentful_api_url="https://cdn.contentful.com/spaces/lyvtxhzy9zgr/environments/master/assets?access_token=${CONTENTFUL_ACCESS_TOKEN}&sys.id[in]=${id_comma_list}&select=fields.file,sys.id"
  contentful_result_jq_filter='reduce .items[] as $asset ({}; .[$asset.sys.id] = "https:" + $asset.fields.file.url)'

  # generate the Contentful image list
  curl --silent --globoff "${contentful_api_url}" | jq "${contentful_result_jq_filter}" > "${image_file_path}"

  cat "${image_file_path}" | grep "https" | sort
}
