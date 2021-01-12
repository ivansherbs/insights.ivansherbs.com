#!/usr/bin/env bash

function generate_redirects {
  echo '# Content custom URLs' > _site/_redirects

  grep -rI 'url:' content | sed 's/^/# /'>> _site/_redirects

  grep --recursive --line-number --include '*.md' --binary-file=without-match --regexp '^url:' content | while read -r redirect_config
  do
    redirect_to=$(echo "${redirect_config}" | cut -d ':' -f 1 | sed 's/^content//' | sed 's/\.md$//')
    redirect_from=$(echo "${redirect_config}" | cut -d ':' -f 4 | sed 's/^ *//')

    echo "${redirect_from} ${redirect_to} 200" >> _site/_redirects
  done
}

function main {
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

main
