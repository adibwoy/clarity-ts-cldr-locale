const prettyTypescript = require('pretty-typescript');
const gulp = require('gulp');

gulp.task('prettify', function () {
    gulp.src('dist/output/**/*.ts')
        .pipe(prettyTypescript())
        .pipe(gulp.dest('dist/output'));
});