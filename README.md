# Otrampala

Otrampala is a news theme for [Ghost](https://github.com/tryghost/ghost/), built for publications that need a fast, clean layout for breaking news, articles, and editorial content.

&nbsp;

# First time using Otrampala?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes. Otrampala follows that same structure, with templates organized by content type.

This theme includes code comments to help explain what's going on just by reading the code. For a deeper dive into how Handlebars helpers work in Ghost, see the [theme API documentation](https://ghost.org/docs/themes/).

**The main files are:**

- `default.hbs` - The parent template, including the global header/footer (masthead, navigation, footer)
- `home.hbs` - The homepage, showing featured and latest stories
- `index.hbs` - The main template for generating a list of posts (section/category feeds)
- `post.hbs` - The template used to render individual news articles
- `page.hbs` - Used for static pages (About, Contact, etc.)
- `tag.hbs` - Used for tag archives, e.g. "all posts tagged with `politics`"
- `author.hbs` - Used for author archives, e.g. "all posts written by a given reporter"

You can also create custom one-off templates by adding a page or tag slug to a template file. For example:

- `page-about.hbs` - Custom template for an `/about/` page
- `tag-breaking.hbs` - Custom template for a `/tag/breaking/` archive
- `author-jane-doe.hbs` - Custom template for an `/author/jane-doe/` archive

&nbsp;

# Development

Otrampala's styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/), and [Gulp](https://gulpjs.com) installed globally. From the theme's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev
```

Edit files in `/assets/css/` — they'll compile automatically to `/assets/built/`.

To package the theme for upload to a live Ghost site:

```bash
# create .zip file
yarn zip
```

This generates `dist/otrampala.zip`, ready to upload.

&nbsp;

# PostCSS Features Used

- Autoprefixer — browser vendor prefixes are handled automatically, with support for the latest 2 major versions of every browser.

&nbsp;

# SVG Icons

Otrampala uses inline SVG icons, included via Handlebars partials. All icons live in `/partials/icons`. To use one, reference its filename — e.g. to include `/partials/icons/rss.hbs`, use `{{> "icons/rss"}}`.

You can add your own SVG icons the same way.

&nbsp;

# Copyright & License

Copyright (c) 2025 Otrampala — Released under the [MIT license](LICENSE).
