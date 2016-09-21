MotionJS 路径动画
=============

一款让元素沿着指定路径运动的jQuery动画插件，依赖于CSS3 transform、 SVG DOM API 和 jQuery Animation，
要求 jQuery 1.8.0+， 支持 IE9+、Chrome、Firefox，在不支持的浏览器将静默无效果。

```javascript
var motion = new Motion(el, {
    path: 'M0 0Q100 100 0 200z',
    offset: 0,
    rotation: 'auto'
});

motion.to(1, {
    duration: 2000,
    easing: 'swing',
    complete: function(){
        this.to(0, 1000);
    }
});
```

## Demo

[demo](http://sandbox.runjs.cn/show/ggcn0e3d)

## Docs

### Motion.isSupport

+ **Details**: 当前浏览器是否支持路径动画；MotionJS 需要 SVG 以支持 path 的解析（支持SVG DOM 的浏览器都支持 CSS3 transform）。

### new Motion(el, options) 

+ **Args**:
    + `{HTMLElement|jQuery} el` `required` 

    + `{Object} options` `required`
        + `{string} options.path`  `required`
        + `{number} options.offset` 
        + `{'auto'|number} options.rotation`

+ **Details**:

    + options.path 指示出路径，参加 svg path 语法。

    + options.offset 表明初始位置，取值范围是[0-1]，默认值 0。

    + options.rotation 可以取 'auto' , 表明随 path 路径自动转动，也可以取数值，单位deg，
    表明以 rotation deg 沿着 path 运动。默认取值 'auto'。


### Motion#to(dest, timing)

+ **Args**:
    + `{number} dest` `required` 

    + `{Object|number} timing`
        + `{number} options.duration` 
        + `{string} options.easing` 
        + `{function} options.complete`

+ **Details**:

    + dest 指明目标偏移量

    + timing.duration 动画耗时 默认 1000ms

    + timing.easing 缓动函数，依赖于jQuery.easing，内置 'linear' 和 'swing' 默认'linear'

    + timing.complete 动画完毕的回调

    + timing 取值 number 时等价于只设置 duration