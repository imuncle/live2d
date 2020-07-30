# live2d
live2d模型收集+展示，可直接用于静态网站

# 展示页面
* [Live2d Cubism 2](https://imuncle.github.io/live2d)
* [Live2d Cubism 3](https://imuncle.github.io/live2d/live2d_3)

以上页面国内访问较慢，而模型较大，可以访问以下地址：

* [Live2d Cubism 2](http://119.23.8.25/live2d)
* [Live2d Cubism 3](http://119.23.8.25/live2d/live2d_3)

目前共计收录**128**个模型。

# 使用说明
## Live2d Cubism 2
* 引用必要的`js`文件：
```html
<script src="js/live2d.js"></script>
```
* 添加`canvas`元素：
```html
<canvas class="live2d" id="live2d" width="300" height="800"></canvas>
```
* 添加`css`样式（非必须，可自定义）：
```html
<style>
    .live2d {
        position: fixed;
        bottom : 0;
        left : 0;
    }
</style>
```
* 初始化live2d：
```js
loadlive2d("live2d", "./model.json");
```

* `LAppDefine.js`为live2d的配置文件，具体的配置信息见注释。

* `model`文件夹下是live2d的模型文件，目前已收录**102**种，其中数种模型有可更换皮肤。
模型文件夹的目录大体如下：
```txt
+-models（模型文件夹名称）
|__+-texture（模型材质包）
|__|___texture_00.png
|__|___texture_01.png
|__|___....
|__+-motions（模型动作组）
|__+-expression（模型表情组）
|__+-sounds（模型音效）
|__model.json（模型资源分布说明文件）
|__model.moc（模型本体）
```
部分模型有所不同。

## Live2d Cubism 3
以上内容都是基于旧的Cubism Editor 2制作与开发，现在官网老早就使用~~Cubism 3了（详见[Cubism 3 | Live2D](https://www.live2d.com/en/products/cubism3)）~~ 已经到了Cubism 4了，不过与Cubism 3是兼容的，而且官方承诺以后的版本都向下兼容（除了Cubism 2）。

Cubism 3使用的是`TypeScript`，相比第二版更加稳健，但我基于[AzurLaneL2DViewer](https://github.com/Yukariin/AzurLaneL2DViewer)这个仓库进行了一些小修改，可像Cubism 2一样直接添加模型，不需要修改核心代码。

live2d Cubism 3全部文件放在`live2d_3`中，可单独使用。

`live2d_3/model`文件夹下是Cubism 3版本的模型，目前收录了碧蓝航线里的**40**个模型。

# 相关链接
* Live2D官方网站： https://www.live2d.com/en/ ； https://live2d.github.io
* [梦象](https://mx-model.ga/) （live2d模型收集站）
* [Live2D！把可爱的看板娘捕捉到你的博客去吧](https://haremu.com/p/205)
* [EYHN/hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d) （向hexo中添加live2d）
* [网页添加 Live2D 看板娘](https://www.fghrsh.net/post/123.html)
* [Live2dDemo](https://github.com/summerscar/live2dDemo) （live2d模型收集站）

# 版权须知
所有模型均收集自互联网，版权均归原公司/个人所有。您可将资源用于学习、非营利性的网站或项目，不得用于商业使用（付费分发售卖资源、二次修改用于盈利等）。