# Doks

A powerful Ghost theme specially designed to create beautiful modern docs, knowledge bases, and help centers. Designed and developed by [Spiritix](https://spiritix.co/).

What you can do with this theme:

* Create one or multiple pieces of documentation (e.g. Docs, Guides, FAQs, API, ...)
* Organize each documentation into sections
* Easily create a changelog timeline to share new  updates of your service or product
* Group your regular blog post into a minimal and clean archive
* Create a showcase to display large and eye-catching visuals
* Optionally, you can create a landing page managed from the admin UI with no coding required

&nbsp;

## Demo
See the theme in action in our live demo: [https://doks.spiritix.co](https://doks.spiritix.co/)

&nbsp;

## Documentation
An up to date documentation is available at [https://spiritix.co/themes/doks](https://spiritix.co/themes/doks/).

Please make sure to go through at least the installation instructions to get your site up and running.

&nbsp;

## Help & Support
Need support or have a suggestion? You can:
- contact us at [https://spiritix.co/contact](https://spiritix.co/contact)
- send an email to [support@spiritix.co](support@spiritix.co)
- DM us on twitter [https://twitter.com/SpiritixHQ](https://twitter.com/SpiritixHQ)

&nbsp;

## Development
### Prerequisite
First, you'll need [Node](https://nodejs.org/) installed globally. 

### Install dependencies
From the theme's root directory, run the following command to install dependencies:

```bash
# install dependencies
npm install
```

### Start development server
The following command starts a development server with Livereload enabled

```bash
# run development server
npm run dev
```

### Compile CSS
We use PostCSS and [TailwindCSS](https://tailwindcss.com/) to manage our CSS.
All CSS files in `/assets/css/` and imported in `/assets/css/main.css`, will be compiled to `/assets/built/main.min.css` automatically, in addition to any TailwindCSS utility class used in .hbs or .js files.

```bash
# compile CSS
npm run css
```

### Compile Javascript
Javascript files in `/assets/js/` will be compiled to `/assets/built/main.min.js` automatically.

```bash
# compile js
npm run js
```

### Build all assets
To compile all assets, run the following command:
```bash
# compile all assets
npm run build
```

### Test theme
To test the theme compatibility using Gscan, run the following command:

```bash
# test with gscan
npm run test
```

### Create ZIP file
The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
npm run zip
```

&nbsp;

## Copyright & License
Copyright (c) Spiritix (spiritix.co)

For the full license text, please read the [LICENSE](LICENSE.md) file included with this project.
