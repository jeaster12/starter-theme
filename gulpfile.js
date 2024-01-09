const { series, watch, src, dest, parallel } = require('gulp');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const pump = require('pump');

// postcss plugins
const easyimport = require('postcss-easy-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const GENERATE_SOURCE_MAPS = false;

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    pump([
        src('assets/css/main.css', { sourcemaps: GENERATE_SOURCE_MAPS }),
        concat('main.min.css'),
        postcss([
            easyimport,
            tailwindcss(),
            autoprefixer(),
            cssnano(),
        ]),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function js(done) {
    pump([
        src([
            './assets/js/lib/lazysizes.js',
            './node_modules/lazysizes/lazysizes.min.js',
            './node_modules/sal.js/dist/sal.js',
            './node_modules/photoswipe/dist/photoswipe.min.js',
            './node_modules/photoswipe/dist/photoswipe-ui-default.min.js',
            './node_modules/imagesloaded/imagesloaded.pkgd.min.js',
            './node_modules/reframe.js/dist/reframe.min.js',
            './node_modules/tocbot/dist/tocbot.min.js',
            './node_modules/prismjs/components/prism-core.min.js',
            './node_modules/prismjs/plugins/autoloader/prism-autoloader.min.js',
            './node_modules/prismjs/plugins/line-highlight/prism-line-highlight.min.js',
            './node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js',
            './node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
            './assets/js/lib/lightbox.js',
            './assets/js/*.js',
        ], {sourcemaps: GENERATE_SOURCE_MAPS}),
        concat('main.min.js'),
        uglify(),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!.DS_Store',
            '!.git', '!.git/**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!demo', '!demo/**',
            '!package-lock.json',
            '!yarn-error.log',
            '!yarn.lock',
            '!TODO.md',
        ], { dot: true }),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

const cssWatcher = () => watch('assets/css/**', css);
const jsWatcher = () => watch('assets/js/**', js);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const tailwindcssWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', 'assets/js/**'], { delay: 300 } , css);
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher, tailwindcssWatcher);
const build = series(css, js);

exports.css = css;
exports.js = js;
exports.build = build;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);