var Builder = require('g-builder');
var builder = module.exports = new Builder(require('./config'));

builder.registerBuilder('**/*.cmb.js')
        .read()
        .pipe(require('g-builder/builders/amd').combine)
        .uglify()
        .write();

builder.registerBuilder('com/g/*.js')
        .copy();

builder.registerBuilder('com/backend/css/fonts/*')
        .copy();

builder.registerBuilder('com/mobile/g.js', 'app/client/common/g.js', 'com/pc/g.js')
        .read()
        .concat()
        .uglify()
        .write();

builder.registerBuilder('**/*.less')
        .read()
        .pipe(require('g-builder/builders/less'))
        .pipe(require('g-builder/builders/css').minify)
        .write({
            rewrite: [/.less$/, '.css']
        });

builder.registerBuilder('**/*.css')
        .read()
        .pipe(require('g-builder/builders/css'))
        .pipe(require('g-builder/builders/css').minify)
        .write();

builder.registerBuilder('com/mobile/lib/zepto/zepto.cmb.js')
        .read()
        .concat()
        .pipe(require('g-builder/builders/amd'))
        .uglify()
        .write();

builder.registerBuilder('version.js')
        .read()
        .pipe(require('g-builder/builders/version.js'))
        .pipe(require('./builder/version.js'))
        .pipe(require('g-builder/builders/amd'))
        .write();

builder.registerBuilder('**/*.js')
        .read()
        /*.pipe(require('g-builder/builders/jshint')({
            configFile: __dirname + '/.jshintrc',
            ignoreFiles: [
                'com/mobile/lib/zepto/*.js'
            ]
        }))*/
        // .pipe(require('./builder/doc/index.js'))
        .pipe(require('g-builder/builders/amd'))
        .uglify()
        .write();

builder.registerBuilder('**/*.tpl')
        .read()
        .pipe(require('./builder/template.js'))
        .pipe(require('g-builder/builders/amd'))
        .uglify()
        .write();

builder.registerBuilder('**/*.appcache')
        .read()
        .pipe(require('./builder/manifest.js'))
        .write();

builder.registerBuilder('**/*.jjson', '**/*.json')
        .read()
        .pipe(require('./builder/json.js'))
        .pipe(require('g-builder/builders/amd'))
        .uglify()
        .write();

builder.registerBuilder('**/*.jcss')
        .read()
        .pipe(require('g-builder/builders/css'))
        .pipe(require('g-builder/builders/css').minify)
        .pipe(require('./builder/jcss.js'))
        .pipe(require('g-builder/builders/amd'))
        .write();

builder.registerDefaultBuilder()
        .copy();
