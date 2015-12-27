var gulp = require('gulp');
var webserver = require('gulp-webserver');
 
gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8000,
      livereload: true,
      directoryListing: true,
      open: true
    }));
});