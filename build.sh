#!/usr/bin/env bash

function generate_redirects {
  echo '# Content custom URLs' > _site/_redirects

  which sed >> _site/_redirects
  grep --recursive --line-number --include '*.md' --regexp '^url:' content >> _site/_redirects

  grep --recursive --line-number --include '*.md' --regexp '^url:' content | while read -r redirect_config
  do
    redirect_from=$(echo "${redirect_config}" | cut -d ':' -f 1 | sed 's/^content//' | sed 's/\.md$//' )
    redirect_to=$(echo "${redirect_config}" | cut -d ':' -f 4 | sed 's/^ *//')

    echo "${redirect_from} ${redirect_to}" 200 >> _site/_redirects
  done
}

function main {
  # templates pre-rendering
  npx eleventy --input content/nl/ivans/veelgestelde-vragen --output _site/nl/ivans/veelgestelde-vragen
  npx eleventy --input content/nl/ivans/voordelen --output _site/nl/ivans/voordelen

  # templates rendering
  npx eleventy

  # generate redirects
  generate_redirects

}

main
