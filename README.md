# live2d
live2d模型收集+展示，可直接用于静态网站

# 展示页面
https://imuncle.github.io/live2d

# 使用说明
* 引用必要的`js`文件：
```html
<script src="js/LAppDefine.js"></script>
<script src="js/live2d.min.js"></script>
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
```html
<script>InitLive2D();</script>
```

* `LAppDefine.js`为live2d的配置文件，具体的配置信息见注释。

* `model`文件夹下是live2d的模型文件，目前已收录**41**种，其中数种模型有可更换皮肤。
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

# 相关链接
* Live2D官方网站：
https://www.live2d.com/en/
https://live2d.github.io
* [梦象](https://mx-model.ga/) （live2d模型收集站）
* [Live2D！把可爱的看板娘捕捉到你的博客去吧](https://haremu.com/p/205)
* [EYHN/hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d) （向hexo中添加live2d）
* [网页添加 Live2D 看板娘](https://www.fghrsh.net/post/123.html)
* [Live2dDemo](https://github.com/summerscar/live2dDemo) （live2d模型收集站）

# 版权须知
所有模型均收集自互联网，版权均归原公司/个人所有。您可将本站资源用于学习、非营利性的网站或项目，不得用于商业使用（付费分发售卖资源、二次修改用于盈利等）。