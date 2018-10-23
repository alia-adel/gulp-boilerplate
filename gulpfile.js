/**
 * Examples from https://css-tricks.com/gulp-for-beginners/ 
 */


var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
// also use npm install --save-dev babel-preset-es2015
const babel = require('gulp-babel');


/**
 * @description The del function takes in an array of node globs which tells it what folders to delete.
 * to execute it, run --> gulp clean:dist
 */
gulp.task('clean:dist', function () {
    return del.sync('dist');
});

/**
 * @description this tasks Sync the browser with the latest html changes
 */
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

/**
 * @description this task compiles sass file to css
 */
gulp.task('sass', function () {
    return gulp.src('app/scss/main/**/*.scss')
        .pipe(sass()) // Using gulp-sass                
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/**
 * @description move fonts to the dist folder
 */
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

/**
 * @description this task optimizes images' sizes
 */
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            // you can create interlaced GIFs by setting the interlaced option key to true
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});


/**
 * @description transpile ES6 to 2015 script
 */
gulp.task('js', function () {
    return gulp.src('app/js/lib/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('app/js/product'))
});

/**
 * @description this task optimize resources in preparation
 * for production build.
 *  -- Merge scripts together & uglify them
 *  -- Merge style sheets together and compress them
 *  -- Optimize images' sizes
 *  -- move everything under the /dist folder
 */
gulp.task('build', ['clean:dist', 'sass', 'js', 'images', 'fonts'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Optimize JavaScript
        .pipe(gulpIf('*.js', uglify()))
        // Optimize StyleSheets
        .pipe(gulpIf('*.css', cssnano()))
        // Optimize Images
        .pipe(gulp.dest('dist'));
});


/**
 * @description this task listens to any change that happens in
 * javaScripts, style sheets and html files
 */
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/main/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
