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
