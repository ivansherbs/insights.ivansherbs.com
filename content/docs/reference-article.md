---
layout: article_with_shopify.html
title: Reference Article
meta:
  description: This is the HTML meta description used also by search engines
  keywords: reference article, sample article, example article, documentation
publish:
  author: If not provided, Ivan's Insights will be used
  date: Aug 28, 2020
style: |
  .single-blog-page .blog-box .blog-img img {
      width: initial;
      max-width: 100%;
  }
---
[[toc]]

# Front Matter Information

The front matter data is placed at the beginning of the article in YAML ([specification](https://yaml.org/spec/1.2/spec.html) and [example](https://yaml.org/spec/1.2/spec.html#id2761803)) format:

```
---
layout: article.html
title: Reference Article
meta:
  description: This is the HTML meta description used also by search engines
  keywords: reference article, sample article, example article, documentation
publish:
  author: If not provided, Ivan's Insights will be used
  date: Aug 28, 2020
---
... here goes the article Markdown content ...
```

## Mandatory fields

* `layout` - tells the page renderer to use this layout for this article. Check the [`_includes`](https://github.com/ivansherbs/articles.ivansherbs.com/blob/master/content/_includes) directory for available layouts.
* `title` - this is the main title of the article used both as the browser tab title as well as the main title header in the article

## Metadata

This information is hidden from the user but relevant for robots like: SEO, RSS, search engines, etc.

* `meta.description` - a relevant article description used in the HTML description meta tag.
* `meta.keywords` - relevant article keywords used in the HTML keywords meta tag.

## Publishing data

This information is visible for the user on the article page.

* `publish.author` - the author of the article. If not provided, `Ivan's Insights` will be used as default.
* `publish.date` - the date when this article was published. You can use any string/format you want as no validation is performed. If not provided, the date is not visible on the article page.

# Page Language

In order to support multiple languages overall on this we:

## Translations

All the translations needed should be present in the `content/_data/i18n.yml` file. This has the following structure:

```
---
my_key:
  EN: This is the English text
  NL: Dit is de Nederlandse tekst
tags:
  EN: Tags
  NL: Trefwoorden
```

## Default language

The page default language is detemned in based on the path of the page (without considering the custom page URL). For example, if a page is located under `content/nl/`, the language will be `NL`, if no other value is defined in the front matter data of the page or any of its parent layouts.

## Using translations on pages

In order to use translations on pages, the following liquid custom tag need to be used at every location where a translated/translatable label is needed:

```
{% i18n '<key>' '<language>' %}<default_text>{% endi18n %}
```

where:

* `<key>` is the translation key defined in the `i18n.yml` file
* `<language> is the language in which you need the translation`
* `<default_text>` is the text that will appear if no value is defined for the `<key>` in that `<language>`

## Examples

### Example 1 - One label translation

```
{{'{'}}% i18n 'tags' 'NL' %}Tags{{'{'}}% endi18n %}
```

generates:

{% i18n 'tags' 'NL' %}Tags{% endi18n %}

### Example 2 - Page-defined language

```
---
language: NL
---
{{'{'}}% i18n 'tags' language  %}Tags{{'{'}}% endi18n %}
{{'{'}}% i18n 'share' language %}Share{{'{'}}% endi18n %}
```

generates:

{% i18n 'tags' 'NL' %}Tags{% endi18n %}<br/>
{% i18n 'share' 'NL' %}Tags{% endi18n %}

### Example 3 - Language based on page location

If this page is defined at location `content/nl/example-page.md`, the following code snippet:

```
{{'{'}}% i18n 'tags' %}Tags{{'{'}}% endi18n %}
```

generates:

{% i18n 'tags' 'NL' %}Tags{% endi18n %}<br/>

because the `/nl/` was detected as the first segment in the path after `content`.

### Example 4 - Missing translation

Assuming this code snippet is used on a page **not defined** under a `content` directory (like `en`, `nl`):

```
{{'{'}}% i18n 'dummy' 'NL' %}{{'{'}}% endi18n %}
```

generates:

{% i18n 'dummy' 'NL' %}{% endi18n %}<br/>

as the `dummy` key is missing fot the `NL` translation and no `<default_text>` was provide in between the `{% i18n %}` and `{% endi18n %}` tags.

# Custom Markdown

## Contentful images

Short version:

```
[[contentfulImage <image_id>]]
```

where the `<image_id>` is the ID of an image published using Contentful.

Long version:

```
[[contentfulImage <image_id> option1=value\ 1 option2='value 2' option3="velue 3" ...]]
```

where you can provide as many `option=value` pairs using the options names and values supported by the [Contentful Images API](https://www.contentful.com/developers/docs/references/images-api/).

### Front matter

You can provide also default properties for all Contentful images on a page by defining the properties in the front matter:

```
---
contentful:
  imageOptions:
    fm: jpg
    q: 50
---
... all the images on this page will be fetched using the JPEG format and a 50% quality ...
```

### Example 1

```
[[contentfulImage 4xERvF6aRTWBQwMFipxC3k]]
```

uses the default Contentful options:

* format: `fm=jpq` (will return a JPEG image regardless of the image uploaded on Contentful)
* quality: `q=50` (will decrease the quality of the image to 50%)

and generates:

[[contentfulImage 4xERvF6aRTWBQwMFipxC3k]]

### Example 2

```
[[contentfulImage 4xERvF6aRTWBQwMFipxC3k fm=png q=100 fit=pad w=600 h=200 bg=yellow]]
```

generates:

[[contentfulImage 4xERvF6aRTWBQwMFipxC3k fm=png q=100 w=600 h=200 fit=pad bg=yellow]]

## Shopify products

```
[[shopifyProduct <product_id> option1=value\ 1 option2='value 2' option3="value 3" ...]]
```

where:

* `<product_id>` is the ID of a product collection deined in Shopify (visible in the Shopify URL when viewing a collection)
* supported options are:
  * `buttonDestination` with possible values: `cart`, `modal` (default), `checkout`, `onlineStore`
  * `buttonText` with any string as value to change the buy button text
  * `language` with possible values: `EN` (default), `NL`

### Front matter

You can provide also default properties for all Shopify products on a page by defining the properties in the front matter:

```
---
shopify:
  language: NL
  buttonDestination: onlineStore
---
... all the products on this page will be displayed in Dutch and link directory to the Shopify online store ...
```

### Example

```
[[shopifyProduct 5659783987366 buttonDestination=cart language=EN]]
```

generates:

[[shopifyProduct 5659783987366 buttonDestination=cart language=EN]]

**Note**: As we have two Shopify examples in different languages on the same page (product example in `EN` and collection example in `NL`), the Shopify integration will show the language last used o this page (which is `NL`).

## Shopify collections

```
[[shopifyCollection <collection_id> option1=value\ 1 option2='value 2' option3="value 3"]]
```

where:

* `<collection_id>` is the ID of a product collection deined in Shopify (visible in the Shopify URL when viewing a collection)
* supported options are:
  * `buttonDestination` with possible values: `cart` (default), `modal`, `checkout`, `onlineStore`
  * `buttonText` with any string as value to change the buy button text
  * `language` with possible values: `EN` (default), `NL`

### Front matter

You can provide also default properties for all Shopify products in all collection on a page by defining the properties in the front matter:

```
---
shopify:
  language: NL
  buttonDestination: onlineStore
---
... all the products in all collection on this page will be displayed in Dutch and link directory to the Shopify online store ...
```

### Example

```
[[shopifyCollection 235510562982 buttonDestination=modal language=NL]]
```

generates:

[[shopifyCollection 235510562982 buttonDestination=modal language=NL]]


# Formatting

## Headings

* `# Section` - section titles.
* `## Sub-section` - sub-section titles.
* `### Sub-sub-section` - sub-sub-section titles.

### Important notes

* If used, the TOC will only show heading levels 1 and 2.
* You **cannot reuse sub-section titles** as they will not be properly linked from the TOC. This is a limitation of the TOC plugin. Duplicate sub-section links in the TOC will point to the first sub-section" having that name in the entire article.

## Table of contents

* `[[toc]]` - introduces the complete TOC in the places where if is used and contains only `# Section` (level 1) and `## Sub-section` (level 2) headings.

### Important notes

* If your first heading is a level 2 heading, no level 1 headings will be generated in the TOC

### Examples

[[toc]]

## Block quotes

* `> Text of the block quote` - can be used for starting articles with a main idea or inside articles for quotes, important take-aways, etc.

### Examples

> This is a blockquote

## Text formatting

* `**text**` or `__text__` - bold text
* `*text*` or `_text_` - italics text

### Examples

This is a **bold text** (using `*` syntax) and this is an *italics text* (using `*` syntax).
This is a __bold text__ (using `_` syntax) and this is an *italics text* (used `_` syntax).

## Lists

* `* text` or `+ text` or `- text` - unordered list element

### Important notes

* The `*`, `+`, `-` can be used mixed even on the same level (but not recommended).
* Sub-items must be indented at least up to the first character of the parent list item.

### Examples

* List item
  * List sub-item (using `*` syntax)
  + List sub-item (using `+` syntax)
  - List sub-item (using `-` syntax)

## Numbered lists

* `1. text` - numbered list item 1
* `1. text` - numbered list item 2

### Important notes

* The numbers used in the numbered list are not relevant as long as they are numbers.
* The generated numbers start from the fist used number. If your first list item uses `10.`, your list will start with 10.
* Sub-items must be indented at least up to the first character of the parent list item.
* One should use the real numbers in the Markdown source (`1.`, `2.`, `3.`) if the lists are short or rarely change.
* One should use the same number in the Markdown source (`1.`, `1.`, `1.`) if the lists are long or they can change more often. This avoids making mistakes and having to manage/update the numbers.

### Examples

1. Numbered list item 1 (using same numbers)
   1. Numbered list sub-item 1 (using same numbers)
      1. Numbered list sub-sub-item 1 (using same numbers)
      1. Numbered list sub-sub-item 2 (using same numbers)
1. Numbered list item 2 (using same numbers)

# Complete Documentation

For a complete Markdown documentation check out the [CommonMark Spec](https://spec.commonmark.org/current/).
