# gulp工作流开发微信小程序
### 背景
微信小程序开发模式比较原始，就样式来说，写惯了less，stylus和sass的同学一定无法忍受wxss的这种写法，基于此，决定使用gulp自动化工具来构建一套微信小程序开发的基础模板，在完全保留微信小程序功能和特性的基础上，又可以的使用less来写样式，同时加入环境配置，配置别名。
### 开发前必看
- 开发如果使用 ESM 模块化语法，需要在开发者工具本地设置开启ES6转ES5，否则报错，因为小程序模块化只支持commonjs
- 本项目统一采用 ESM 模块化语法
- 配置别名(@@)只针对 js 文件，其他文件暂不支持，例如：import { formatTime } from '@@/utils/index.js'
- 图片资源先压缩后使用，压缩网站：https://tinypng.com/
- 微信开发者工具导入项目时，注意最内层路径就是当前项目根目录，不要定位到dist目录
- 由于项目使用了npm第三方组件库，npm install 完成之后，点击开发者工具中的菜单栏：工具 --> 构建 npm，完成后，本地设置，勾选“使用 npm 模块”选项，关于 npm 使用官方文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html
### 安装依赖
```
npm install
```
### 开发环境
```
npm run dev
```
### uat环境
```
npm run uat
```
### 生产环境
```
npm run prod
```