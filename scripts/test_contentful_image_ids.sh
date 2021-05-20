#!/usr/bin/env bash

. "$(dirname "$0")/collect_contentful_images.sh"

collection_type=$1
tmp_path_prefix=${TMPDIR}${RANDOM}

if [ "${collection_type}" == "inline" ]
then
  collect_sorted_unique_inline_image_ids > "${tmp_path_prefix}-used.txt"
  collect_sorted_generated_image_ids inline > "${tmp_path_prefix}-found.txt"
elif [ "${collection_type}" == "banner" ]
then
  collect_sorted_unique_banner_image_ids > "${tmp_path_prefix}-used.txt"
  collect_sorted_generated_image_ids banner > "${tmp_path_prefix}-found.txt"
else
  >&2 echo "Invalid Contentful image type: ${collection_type}"
  exit 1
fi

invalid_image_refereces=$(comm -23 "${tmp_path_prefix}-used.txt" "${tmp_path_prefix}-found.txt" | awk '{ print $1 }')
if [ -n "${invalid_image_refereces}" ]
then
  echo "${invalid_image_refereces}"
  exit 2
fi
