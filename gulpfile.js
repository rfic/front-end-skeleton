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
  wiredep: {
    directory: './src/bower_components'
  }
};

/**** Worker ****/
var App = {  
  
  log: function  ($text) {
    gutil.log(gutil.colors.yellow($text));
  },
  
  moveAssets: function () {
    this.log('Move Images');
    gulp.src([options.src + '/images/'])
      .pipe(gulp.dest(options.dist));  
    return this;
  },
    
  public: function () {
    this.log('build asset files');
    var assets = $.useref.assets(),
        cssFilter = $.filter('/css/*.css'),
        jsFilter = $.filter('**/*.js');
        
    gulp.src(options.html)
       .pipe($.plumber())
       .pipe(assets)
       // Optimize CSS
       .pipe(cssFilter)
       .pipe($.csso())
       .pipe(cssFilter.restore())
       // Optimize JS
       .pipe(jsFilter)
       .pipe($.sourcemaps.init())
       .pipe($.uglify())
       .pipe($.sourcemaps.write())
       .pipe(jsFilter.restore())
       // .pipe($.rev())
       .pipe(assets.restore())
       .pipe($.useref())
       // .pipe($.revReplace())
       .pipe(gulp.dest(options.dist));    
       
    return this;
  },
  
  delete: function () {
    del([options.dist + '/', options.css, options.html], function(err, deletedFiles) {
      gutil.log(gutil.colors.red('Files deleted:'));
      deletedFiles.forEach(function(entry) {
        gutil.log(gutil.colors.yellow(entry));
      });
    });
  },

  inject: function () {
    this.log('Inject');
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
    
    gulp.src(options.html)
      .pipe($.plumber())
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.src));
    return this;
  },
  
  jade: function () {
    this.log('Jade');
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
      .pipe($.complexity());
    return this;
  },
  
  sass: function () {
    this.log('Sass');
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
    return this;
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
gulp.task('inject',['jade'], function() {
  App.inject();
});

/** Convert JADE to HTML **/
gulp.task('jade', function() {
  App.jade();
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
  .jade()
  .sass()
  .server()
  .inject();
});

gulp.task('build',['sass','inject'], function() {
  App
  .moveAssets()
  .public();
});