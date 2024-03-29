//**********************************
// run app script
//**********************************
'use strict';

var path = require('path');
var gulp = require('gulp');
var util = require('util');
var conf = require('./conf');
var dev = require('./dev');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var proxyMiddleware = require('http-proxy-middleware');

function isOnlyChange(event) {
  return event.type === 'changed';
}

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  var proxy_main = proxyMiddleware('/api/v2/**', {target: 'http://innertest.aircommunity.cn', changeOrigin: true});
  // var proxy_main = proxyMiddleware('/api/v2/**', {target: 'http://aircommunity.net', changeOrigin: true});
  //var proxy_main = proxyMiddleware('/api/v2/**', {target: 'http://localhost:8080', changeOrigin: true});
  //var proxy_main = proxyMiddleware('/api/v1/**', {target: 'http://10.70.80.92', changeOrigin: true});


/*
  var proxy_ua = proxyMiddleware('/cp-ua/v1/!**', {target: 'http://172.16.5.240:8072', changeOrigin: true});
  var proxy_gogs = proxyMiddleware('/appMng/v1/!**', {target: 'http://172.16.5.119:8088', changeOrigin: true});
  var proxy_k8s = proxyMiddleware('/k8s-middleware/v1/!**', {target: 'http://172.16.5.245:8080', changeOrigin: true});
  var proxy_cloudservice = proxyMiddleware('/cp/v1/!**', {target: 'http://172.16.5.240:8073', changeOrigin: true});

*/


  var proxy_ua = proxyMiddleware('/cp-ua/v1/**', {target: 'http://223.202.32.56:8051', changeOrigin: true});
  var proxy_gogs = proxyMiddleware('/appMng/v1/**', {target: 'http://223.202.32.56:8051', changeOrigin: true});
  var proxy_k8s = proxyMiddleware('/k8s-middleware/v1/**', {target: 'http://223.202.32.56:8051', changeOrigin: true});
  var proxy_cloudservice = proxyMiddleware('/cp/v1/**', {target: 'http://223.202.32.56:8051', changeOrigin: true});



   server.middleware = [proxy_main, proxy_ua, proxy_gogs, proxy_k8s,proxy_cloudservice];//proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});
  //http://127.0.0.1:8080/iot/api/v1/
  console.log(JSON.stringify(server));
  browserSync.instance = browserSync.init({
    startPath: '/',
    port: conf.server.port,
    server: server,
    browser: browser
  });
}


browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('reload:styles', ['app:less']);

gulp.task('reload:scripts', ['app:js'], function() {
    browserSync.reload({stream:true});
});

gulp.task('reload:inject', ['dev'], function() {
    browserSync.reload();
});

var exec = require('child_process').exec;

gulp.task('startDevServer', function (cb) {

  exec('npm start --prefix server-stub', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})


/*gulp.task('startDevServer', function() {
  npm start --prefix server-stub
});
*/

gulp.task('watch', ['dev'], function () {
  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['reload:inject']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.less'),
    path.join(conf.paths.src, '/assets/styles/**/*.css'),
    path.join(conf.paths.src, '/assets/styles/less/**/*.less')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('reload:styles');
    } else {
      gulp.start('reload:inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('reload:scripts');
    } else {
      gulp.start('reload:inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
     browserSync.reload(event.path);
  });
});

/**
 * Run server with dev
 */
gulp.task('run:dev', ['watch'], function () {

  exec('npm start --prefix server-stub', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });


  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src, path.join(conf.paths.src, '/assets')]);
});
gulp.task('run', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src, path.join(conf.paths.src, '/assets')]);
});

/**
 * Run server with prd with build
 */
gulp.task('run:build', ['build'], function () {
  browserSyncInit(conf.paths.build);
});

/**
 * Run server with prd without build
 */
gulp.task('run:prd', function () {
  browserSyncInit(conf.paths.build);
});