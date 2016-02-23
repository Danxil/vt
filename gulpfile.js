'use strict';
var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var del = require('del');

var config = require('./config.json');

gulp.task('default', ['build', 'js:watch', 'css:watch', 'images:watch', 'templates:watch', 'copy:watch', 'vendor:js:watch', 'vendor:css:watch']);

gulp.task('build', ['clean', 'copy', 'fonts', 'js:dev', 'css:dev', 'vendor:js:dev', 'vendor:css:dev', 'images:dev', 'templates']);

gulp.task('dist', ['clean', 'copy', 'fonts', 'js:prod', 'css:prod', 'vendor:js:prod', 'vendor:css:prod', 'images:prod', 'templates']);

gulp.task('clean', function (cb) {
    del.sync([config.bases.dist + '/**/*.*'], {force: true});
    cb();
});

gulp.task('copy', function () {
    gulp.src(config.path.copy, {read: true})
        .pipe(gulp.dest(config.bases.dist));
});

gulp.task('fonts', function () {
    gulp.src(config.path.fonts, {read: true})
        .pipe(gulp.dest(config.bases.dist + '/fonts'));
});

gulp.task('copy:watch', function () {
    gulp.watch(config.path.copy, ['copy']);
});

gulp.task('js:dev', function () {
    gulp.src(config.path.scripts)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.plumber())
        .pipe(plug.concat('app.js'))
        // .pipe(plug.uglify())
        .pipe(plug.sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.bases.dist + '/js'));
});

gulp.task('js:prod', function () {
    gulp.src(config.path.scripts)
        .pipe(plug.plumber())
        .pipe(plug.concat('app.js'))
        .pipe(gulp.dest(config.bases.dist + '/js'));
});

gulp.task('js:watch', function () {
    gulp.watch(config.path.scripts, ['js:dev']);
});

gulp.task('css:dev', function () {
    gulp.src(config.path.sass.src)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.plumber())
        .pipe(plug.sass(config.path.sass.conf))
        .pipe(plug.sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.bases.dist + '/css'));
});

gulp.task('css:prod', function () {
    gulp.src(config.path.sass.src)
        .pipe(plug.plumber())
        .pipe(plug.sass(config.path.sass.conf))
        .pipe(gulp.dest(config.bases.dist + '/css'));
});

gulp.task('css:watch', function () {
    gulp.watch(config.path.sass.watch, ['css:dev']);
});

gulp.task('templates', function() {
    gulp.src(config.path.html)
        .pipe(plug.angularTemplatecache('app.tpls.js', {
            module: 'app.tpls',
            standalone: true
        }))
        .pipe(gulp.dest(config.bases.dist + '/js'));
});

gulp.task('templates:watch', function () {
    gulp.watch(config.path.html, ['templates']);
});


gulp.task('vendor:js:dev', function() {
    return gulp.src(config.path.libs)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('app.vendor.js'))
        .pipe(plug.sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.bases.dist + '/js'));
});

gulp.task('vendor:js:prod', function() {
    return gulp.src(config.path.libs)
        .pipe(plug.concat('app.vendor.js'))
        .pipe(plug.uglify())
        .pipe(gulp.dest(config.bases.dist + '/js'));
});

gulp.task('vendor:js:watch', function () {
    gulp.watch(config.path.libs, ['vendor:js:dev']);
});

gulp.task('vendor:css:prod', function() {
    return gulp.src(config.path.css_libs)
        .pipe(plug.concat('app.vendor.css'))
        .pipe(gulp.dest(config.bases.dist + '/css'));
});

gulp.task('vendor:css:dev', function() {
    return gulp.src(config.path.css_libs)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('app.vendor.css'))
        .pipe(plug.sourcemaps.write('../maps'))
        .pipe(gulp.dest(config.bases.dist + '/css'));
});

gulp.task('vendor:css:watch', function () {
    gulp.watch(config.path.css_libs, ['vendor:css:dev']);
});


gulp.task('images:dev', function () {
    return gulp.src(config.path.images)
        .pipe(gulp.dest(config.bases.dist + '/images'));
});

gulp.task('images:watch', function () {
    gulp.watch(config.path.images, ['images:dev']);
});

gulp.task('images:prod', function () {
    return gulp.src(config.path.images)
        .pipe(plug.imagemin({
            progressive: true,
        }))
        .pipe(gulp.dest(config.bases.dist + '/images'));
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(plug.webserver({
            fallback: 'index.html',
            livereload: false,
            port: 9999
        }));
});