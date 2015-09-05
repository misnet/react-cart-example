# react-cart-example
## 所涉及的第三方库
本项目是react+reflux+react-route的使用示例。主要涉及的js第三方库有：
- jQury V2.1.4
- Bootstrap V3.3.5
- react V0.13.3
- [reflux](https://github.com/reflux/refluxjs) V0.2.12
- [react-router](https://github.com/rackt/react-router) V0.13.x
- [lodash](https://github.com/lodash/lodash/) V3.10.1
- [requirejs](http://requirejs.org) V2.1.20
- [layer](http://layer.layui.com/) V2.0

## 目录说明
* app r.js工具将dist目录下的文件进行打包，生成后的文件放在app目录
* css 样式文件
* data 示例用的json数据文件
* dist 通过react的jsx工具编译生成的目录，是src的js版本
* font-awesome
* fonts
* img
* js
* --langs 语言包文件
* src 源程序目录，里面都是jsx文件，通过react的jsx工具可以编译到dist目录，生成js文件
* tools  requirejs的r.js工具使用的配置文件，可以将dist目录的文件进行打包，主要是针对dist/page下的文件进行打包，生成的目录放在app目录
