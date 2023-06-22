"use strict"

const {src, dest} = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const notify = require("gulp-notify")
const del = require("del");
const panini = require("panini");
const gulp = require("gulp");
const cleanCSS = require('gulp-clean-css');
const gulpCssBeautify = require("gulp-cssbeautify");
const gulpCssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const gulpStripCssComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
     // unused plugins
const gulpClean = require("gulp-clean");
const rigger = require("gulp-rigger");
const gulpRename = require("gulp-rename");
const gulpImagemin = require("gulp-imagemin");
const gulpJsMinify = require("gulp-js-minify");
const gulpConcat = require("gulp-concat");

        // Paths
const srcPath = "src/";
const distPath = "dist/";

const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        images: distPath + "assets/images/",
        fonts: distPath + "assets/fonts/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,pdf,gif,ico,webp,xml,json,webmanifest,webp}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/scss/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,pdf,gif,ico,webp,xml,json,webmanifest,webp}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

function serv() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
}

function html() {
    panini.refresh()
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + "templates/layouts/",
            partials: srcPath + "templates/partials/"
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({stream:true}))
}

function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"}) 
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %"
                })(err);
                this.emit("end")
            }
        }))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }
        ))
        .pipe(gulpCssBeautify())
        .pipe(dest(path.build.css))
        .pipe(gulpCssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulpStripCssComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream:true}))
}

function js () {
    return src(path.src.js, {base: srcPath + "assets/js/"}) 
    .pipe(plumber({
        errorHandler: function(err) {
            notify.onError({
                title: "JS Error",
                message: "Error: <%= error.message %"
            })(err);
            this.emit("end")
        }
    }))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    // .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min",
        extname: ".js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({stream:true}))
}

function images () {
    return src(path.src.images, {base: srcPath + "assets/images/"}) 
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 80, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({stream:true}))
}

function clean () {
    return del(path.clean)
}

function fonts () {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"}) 
    .pipe(browserSync.reload({stream:true}))
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html,css,js,images,fonts))
const watch = gulp.parallel(build, watchFiles, serv)


exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;




















 
 