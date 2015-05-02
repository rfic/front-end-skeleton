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
* `gulp jade` Convert jada files to html
* `gulp sass` Convert sass files to css
* `gulp build` Build production version
* `gulp clean` Remove tmp files and directories 
* `gulp inject` Insert js css paths
* `gulp js` Analyse js code
* `gulp css` Analyse css code
* `gulp analyse` Analyse js and css
* `gulp bump` Update version
* `gulp serv` Start server

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