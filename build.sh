#!/usr/bin/env bash

# templates pre-rendering
npx eleventy --input content/nl/ivans/veelgestelde-vragen --output _site/nl/ivans/veelgestelde-vragen
npx eleventy --input content/nl/ivans/voordelen --output _site/nl/ivans/voordelen

# templates rendering
npx eleventy
