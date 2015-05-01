# front-end-skeleton 

## Usage

### Create your project

Install the required tools: `gulp`, `bower`
```

npm install -g gulp bower
```

and

Download this repository and remove, after remove .git direcotry
```

npm install; bower install
```

### Use Gulp tasks

* `gulp` Launch a browser sync server and build dev source files
* `gulp jade` 
* `gulp sass`
* `gulp build`
* `gulp clean`
* `gulp inject`
* `gulp js`
* `gulp css`
* `gulp analyse`
* `gulp bump`
* `gulp serv`

More information on the gulp tasks in [this README.md](app/templates/gulp/README.md).

The root directory:
<pre>
├──  src/
│   ├──  bower_components/
│   ├──  images/
│   ├──  scripts/
│   │   └──  app.js
│   ├──  styles/
│   ├──  templates/
│   │   └──  parts/
│   │   │   ├──  _head_js.html
│   │   │   ├──  _head_css.html
│   │   │   └──  _footer_js.html
│   │   ├── _footer.jade
│   │   ├── _header.jade
│   │   └── _layout.jade
│   └── index.jade
├──  nodes_modules/*
├──  .bowerrc
├──  .gitignore
├──  .jshintrc
├──  bower.json
├──  gulpfile.js
├──  package.json
</pre>

## **TODO**
* Test framework: Jasmine, Mocha, Qunit