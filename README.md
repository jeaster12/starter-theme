# Waypoint Theme based on Ghost Starter Theme

Additional theme docs here - https://spiritix.co/themes/doks/

## Development guide

The Starter theme provides a first-class development experience out of the box. 

## Ghost setup quickstart install

If you want to run your own instance of Ghost, in most cases the best way is to use our **CLI tool**

```
npm install ghost-cli -g
```

&nbsp;

Then, if installing locally add the `local` flag to get up and running in under a minute - [Local install docs](https://ghost.org/docs/install/local/)

```
ghost install local
```

&nbsp;

### Setup

To see realtime changes during development, symlink the Starter theme folder to the `content/themes` folder in your local Ghost install. 

```bash
ln -s /path/to/starter-theme /ghost/content/themes/starter-theme
```

### Upload the theme ZIP file

First, you must upload the theme ZIP file that you received and downloaded after purchase. 
Follow the steps below to upload and activate the theme:

- Login to Ghost admin at http://localhost:2368/ghost
- Go to the settings page by clicking on the settings icon in the bottom left corner
- Next, click on "Design"
- Then click on "Change theme" in the bottom left corner
- Next, click on "Upload theme" in the top right corner and select the theme ZIP file
- Once the upload is completed, click on "Activate"
Upload the routes.yaml file

*Configuring the routes.yaml file is required for the theme to work properly, follow the steps below to set it up:*

- Go to the settings page by clicking on the settings icon in the bottom left corner
- Next, click on "Labs"
- Scroll to the "Routes" section and click on the "Upload routes YAML" button
- Select and upload the routes.yaml file that you find inside the theme root folder

**This file defines the routes and collections 
Uploading the routes.yaml file is a required step, without it the theme will not work properly.**


### Install dependencies

From the theme's root directory, run the following command to install dependencies:

```bash
npm install
```

#### Start development server

The following command starts a development server with Livereload enabled

```bash
npm run dev
```

#### Compile CSS

We use PostCSS and TailwindCSS to manage our CSS. All CSS files in /assets/css/ and imported in /assets/css/main.css, will be compiled to /assets/built/main.min.css automatically, in addition to any TailwindCSS utility class used in .hbs or .js files.

```bash
npm run css
```

#### Compile Javascript

Javascript files in /assets/js/ will be compiled to /assets/built/main.min.js automatically.

```bash
npm run js
```

#### Build all

To compile all assets, run the following command:

```bash
npm run build
```

#### Test theme

To test the theme compatibility using Gscan, run the following command:

```bash
npm run test
```

#### Create ZIP file

The zip Gulp task packages the theme files into dist/<theme-name>.zip, which you can then upload to your site.

```bash
npm run zip
```

#### Test ghost compatibility

Use `gscan` to test your theme for compatibility with Ghost:

```bash
npm run test
```

&nbsp;
