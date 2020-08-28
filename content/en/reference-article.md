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
[[toc]]

# Front Matter Information

The front matter data is placed at the beginning of the article in YAML ([specification](https://yaml.org/spec/1.2/spec.html) and [example](https://yaml.org/spec/1.2/spec.html#id2761803)) format:

```
---
layout: article.html
tags: article-en
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

## Atom Feed

We have are generating one Atom feed per language. In order to have an article added to the language Atom feed, one has to use one of the following `tags` in the front matter:

* `tags: article-en` - will add the article to the English Atom feed
* `tags: article-nl` - will add the article to the Dutch Atom feed

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

## Complete Markdown documentation

For a complete Markdown documentation check out the [CommonMark Spec](https://spec.commonmark.org/current/).
