const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const del = require('del');
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const tap = require("gulp-tap");
const notify = require("gulp-notify");

const srcPath = './src/**';
const distPath = './dist/';
const wxmlFiles = [`${srcPath}/*.wxml`];
const lessFiles = [`${srcPath}/*.{less,wxss}`];
const jsonFiles = [`${srcPath}/*.json`];
const jsFiles = [`${srcPath}/*.js`];
const imageFiles = [`${srcPath}/images/*.{png,jpg,svg,gif}`,`${srcPath}/images/**/*.{png,jpg,svg,gif}`];
const configFiles = [`./config/*.js`];

const onError = function(err) {
  notify.onError({
    title: "Gulp",
    subtitle: "Failure!",
    message: "Error: <%= error.message %>",
    sound: "Beep"
  })(err);

  this.emit("end");
};

/* 配置别名 */
const babelCfg = {
  plugins: [[
    require.resolve('babel-plugin-module-resolver'),
    {
      "root": ["./src"],
      "alias": {
        "@@": "./src/"
      }
    }
  ]]
};

/* 清除dist目录 */
gulp.task('clean', done => {
  del.sync(['dist/**/*','!dist/miniprogram_npm']);
  done();
});

/* 编译wxml文件 */
const wxml = () => {
  return gulp
    .src(wxmlFiles, { since: gulp.lastRun(wxml) })
    .pipe(gulp.dest(distPath));
};
gulp.task(wxml);

/* 编译json文件 */
const json = () => {
  return gulp
    .src(jsonFiles, { since: gulp.lastRun(json) })
    .pipe(gulp.dest(distPath));
};
gulp.task(json);

/* 编译JS文件 */
const js = () => {
  return gulp
    .src(jsFiles, { since: gulp.lastRun(js) })
    .pipe(babel(babelCfg))
    .pipe(gulp.dest(distPath));
};
gulp.task(js);

/* 编译less文件 */
const wxss = () => {
  return gulp
    .src(lessFiles, { since: gulp.lastRun(wxss) })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(less())
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(distPath));
};
gulp.task(wxss);

/* 配置拷贝图片 */
const copyImg = () => {
  return gulp
    .src(imageFiles)
    .pipe(gulp.dest(distPath));
}
gulp.task(copyImg);

/* 配置请求地址相关 */
const envJs = (env) => {
  return () => {
    return gulp
      .src(`./config/${env}.js`)
      .pipe(rename(`config.env.js`))
      .pipe(gulp.dest(distPath));
  };
};
gulp.task('devEnv', envJs('dev'));
gulp.task('uatEnv', envJs('uat'));
gulp.task('prodEnv', envJs('prod'));

/* watch */
gulp.task('watch', () => {
  gulp.watch(lessFiles, wxss);
  gulp.watch(jsFiles, js);
  gulp.watch(jsonFiles, json);
  gulp.watch(wxmlFiles, wxml);
  gulp.watch(imageFiles, copyImg);
  gulp.watch(configFiles);
});

/* dev */
gulp.task('dev', gulp.series('clean', gulp.parallel( 'wxml', 'js', 'json', 'wxss', 'copyImg', 'devEnv'), 'watch'));

/* uat */
gulp.task('uat', gulp.series('clean', gulp.parallel( 'wxml', 'js', 'json', 'wxss', 'copyImg', 'uatEnv')));

/* build */
gulp.task('build', gulp.series('clean', gulp.parallel( 'wxml', 'js', 'json', 'wxss', 'copyImg', 'prodEnv')));
