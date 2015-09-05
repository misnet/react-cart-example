# react-cart-example
## 演示地址
[React购物车 演示地址](http://www.tapy.org/react-cart)
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

## Flux模式说明
```
╔═════════╗       ╔════════╗       ╔═════════════════╗
║ Actions ║──────>║ Stores ║──────>║ View Components ║
╚═════════╝       ╚════════╝       ╚═════════════════╝
     ^                                      │
     └──────────────────────────────────────┘

```
主要要理清楚Action，Store，Component的关系，记住三者之间是单向的数据流关系，Component需要更新就发起Action请求，由Action去调动Store，而Store的更新又可以通过Store与Component的绑定关系更新Component（利用Component的State属性）

## 相关工具在本项目的应用


* jsx文件编绎成js文件：借助react-tools：，命令行示例如下：
```bash
jsx -x jsx -w src/ dist/
```
* 项目中用到的打包工具是r.js，命令行示例如下：
```bash
cd tools
r.js -o build.js
```
示例文件未使用打包后的js文件，系统会加载用到的所有js文件，为减少js请求，可以将这些js进行统一打包。需要可以借助r.js打包工具进行打包，tools/build.js的配置是将dist/page的文件打包并到app/page目录，有关r.js的使用请自行查询。

打包完成后，要使用打包文件，请修改index.html的require.config部分，将'app':'../dist'改为'app':'../app'即可
