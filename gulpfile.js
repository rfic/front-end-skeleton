'use strict';
/**** COMPONENTS ****/
var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')({lazy: true}),
    args   = require('yargs').argv,
    bSync  = require('browser-sync'),
    del    = require('del'),
    useref = require('gulp-useref'),
    gutil  = require('gulp-util');

/**** Paths ****/
var options = {
  src      : './src',
  dist     : './dist',
  images   : './src/images/',
  jade     : ['./src/**/!(_).jade'],
  sass     : ['./src/styles/sass/*.scss'],
  css      : './src/styles/*.css',
  js       : './src/scripts/*.js',
  html     : './src/!(_).html',
  inject   : ['./src/templates/parts/_head_css.html', './src/templates/parts/_head_js.html','./src/templates/parts/_footer_js.html'],
  templates: './src/templates/parts/',
  wiredep: {
    directory: './src/bower_components'
  }
};

/**** Worker ****/
var App = {  
  
  move: function () {
    gulp.src([options.js])
      .pipe(gulp.dest(options.dist + '/images/'));  
    gulp.src([options.js])
      .pipe(gulp.dest(options.dist + '/js/'));
    gulp.src([options.css])
      .pipe(gulp.dest(options.dist + '/css/'));
    return this;
  },
  
  delete: function () {
    del([options.dist + '/', options.css, options.html, ''], function(err, deletedFiles) {
      gutil.log(gutil.colors.red('Files deleted:'));
      deletedFiles.forEach(function(entry) {
        gutil.log(gutil.colors.yellow(entry));
      });
    });
  },

  inject: function () {
    var wiredep = require('wiredep').stream;
    var injectStyles = gulp.src([options.css], {
      read: false
    }, {
      relative: true
    });
    var injectScripts = gulp.src([options.js], {
      read: false
    }, {
      relative: true
    });
    
    var injectOptions = {
      addRootSlash: false,
      ignorePath: '/src/'
    };
    
    gulp.src(options.inject)
      .pipe($.plumber())
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.templates));
    return this;
  },
  
  jade: function () {
    gulp.src(options.jade)
      .pipe($.jade({
        pretty: true
      }))
      .pipe(gulp.dest(options.src))
      .pipe($.size());
    return this;
  },
  
  js: function () {
    gulp.src(options.js)
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.complexity())
      .pipe(bSync.reload({
        stream: true 
      }));
    return this;
  },
  
  sass: function () {
    gulp.src(options.sass)
      .pipe($.plumber())
      .pipe($.sass({
        errLogToConsole: true
      }))
      .pipe($.autoprefixer({ browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
      .pipe($.csscomb())
      .pipe(gulp.dest(options.src + '/styles'));
    return this;
  },
  
  css: function () {
    gulp.src(options.css)
      .pipe($.plumber())
      .pipe($.csslint())
      .pipe($.csslint.reporter());
    return this;
  },
  
  server: function () {
    if (bSync.active) {
      gutil.log(gutil.colors.blue('bSync is active'));
      return;
    }
    bSync({
      files: [options.css, options.js, options.html],
      server: {
        baseDir: options.src
      }
    });
    gulp.watch(options.sass, ['sass']);
    gulp.watch(options.jade, ['jade']);
    gulp.watch(options.html, function(event) {
      bSync.reload(event.path);
    });
  },
  
  build: function () {
    this.sass()
        .jade()
        .move();
  },
  
  analyse: function () {
    this.js()
        .css();
  },
  
  testing: function() {
    //TODO
  },  
  
  versioning: function($param) {
    gulp.src(['./bower.json', './package.json'])
      .pipe($.plumber())
      .pipe($.bump({
        type: $param
      }))
      .pipe(gulp.dest('./'));
  }
};

/**** Tasks ****/
/** Remove dist folder, css and html files from src **/
gulp.task('clean', function() {
  App.delete();
});
/** Insert CSS and JS paths into loyat parts **/
gulp.task('inject', function() {
  App.inject();
});

/** Convert JADE to HTML **/
gulp.task('jade', function() {
  App
  .inject()
  .jade();
});

/* java script code quality  */
gulp.task('js', function() {
  App.js();
});

/* java script code quality  */
gulp.task('sass', function() {
  App.sass();
});

/** CSS code quality (static analysis) check **/
gulp.task('css', function() {
  App.css();
});

gulp.task('analyse', function() {
  App.analyse();
});

/** Update version -type=major|minor|patch|prerelease **/
gulp.task('bump', function() {
  var part = 'patch';
  if (args.type != null) {
    part = args.type;
  }
  App.versioning(part);
});

/** Turn on the server  **/
gulp.task('serv', function() {
  App.server();
});

gulp.task('default', function() {
  App
  .inject()
  .jade()
  .sass()
  .server();
});

gulp.task('build', function() {
  App.build();
});