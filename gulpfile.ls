require! <[gulp gulp-util express connect-livereload tiny-lr gulp-livereload path]>

app = express!
lr = tiny-lr!

gulp.task 'html' ->
    gulp.src './views/*.html'
        .pipe gulp-livereload lr

gulp.task 'index' ->
    gulp.src './index.html'
        .pipe gulp-livereload lr

gulp.task 'js' ->
    gulp.src './assets/scripts/*.js'
        .pipe gulp-livereload lr

gulp.task 'img' ->
    gulp.src './assets/imgs/*'
        .pipe gulp-livereload lr

gulp.task 'css' ->
    gulp.src './assets/styles/*.css'
        .pipe gulp-livereload lr

gulp.task 'data' ->
    gulp.src './assets/data/*'
        .pipe gulp-livereload lr

gulp.task 'server', ->
    app.use connect-livereload!
    app.use express.static path.resolve '.'
    app.listen 3000
    gulp-util.log 'listening on port 3000'

gulp.task 'watch', ->
    lr.listen 35729, ->
        return gulp-util.log it if it
    gulp.watch './views/*.html', <[html]>
    gulp.watch './index.html', <[index]>
    gulp.watch './assets/scripts/*.js', <[js]>
    gulp.watch './assets/imgs/*', <[img]>
    gulp.watch './assets/styles/*.css', <[css]>
    gulp.watch './assets/data/*', <[data]>

gulp.task 'dev', <[server watch]>
gulp.task 'default', <[build]>
