# pc 移动端 -js 滑块验证 自适应插件(不支持IE)

### 1、介绍
pc 移动端 -js 滑块验证 自适应插件； 自适应自动跳转样式，修改样式，圆角，边框，背景，颜色等

<br/>

插件地址: [https://gitee.com/TGODS/sliderVerif](https://gitee.com/TGODS/sliderVerif) 

<br/>


### 2、使用说明
<br/>

>引入： `<script src="./js/sliderVerif.js"></script>`


<br/>

使用:
```js
#box 插入位置的类名或id   {} 参数

var box = new sliderVerif("#box", {
    sliderText: "请按住滑块拖动",// 滑块提示文字
    succText: "验证通过",// 滑块完成提示文字
    sliderTextColor: "#666",//滑块提示文字颜色
    succTextColor: "#fff",//滑块完成提示文字颜色
    fontSize: 1,//字体大小  数字/字符串 字符串可以带单位 ，数字默认单位 em

    /**
     * 盒子 样式
     */
    boxStyle: {
        bg: "#e5e5e5",//背景颜色  颜色名称，RGB,RGBA,16进制
        barBg: "#5abc3c",// 进度条 背景颜色   颜色名称，RGB,RGBA,16进制
        radius: 0,//按钮圆角   数字/字符串  字符串可以带单位，同 border-radius
        borderWidth: 0,//边框宽度  数字/字符串 字符串可以带单位
        borderColor: "#333",//边框颜色  颜色名称，RGB,RGBA,16进制
        borderStyle: "solid",//边框样式   同 css border-style 属性值
    },
    /**
     * 按钮 样式
     */
    btnStyle: {
        color: "#333",// 按钮 图标颜色   颜色名称，RGB,RGBA,16进制
        succColor: "#5abc3c",//滑动完成 图标颜色    颜色名称，RGB,RGBA,16进制
        bg: "#fff",//按钮背景颜色    颜色名称，RGB,RGBA,16进制
        succBg: "#fff",//滑动完成 背景颜色    颜色名称，RGB,RGBA,16进制
        radius: null,//按钮圆角   数字/字符串  字符串可以带单位，同 border-radius，不是数字和字符串，使用 boxStyle.radius
        borderWidth: 1,//边框宽度  数字/字符串 字符串可以带单位
        borderColor: "#e5e5e5",//边框颜色   颜色名称，RGB,RGBA,16进制
        borderStyle: "solid",//边框样式   同 css border-style 属性值
    },
    // 是否监听屏幕变化，自动修改响应式样式
    isResizeAutoStyle: false,
    //返回状态方法
    getCompleteState: (res) => {
        console.log(res);
    },
});
```

<br/>
<br/>




### 3、参数说明

参数名 | 参数作用 | 参数类型|默认值 | 描述/注意
:------ | :------|:------:|:------:|:------:
sliderText | 滑块提示文字 | String        |   请按住滑块拖动 | -
succText | 滑动完成提示文字 | String        |   验证通过     | -
sliderTextColor | 滑块提示文字颜色 | String        |   #666     |  颜色名称，RGB，RGBA，16进制
succTextColor | 滑动完成提示文字颜色 | String        |   #fff     |  颜色名称，RGB，RGBA，16进制
fontSize | 提示文字字体大小 | Number/String        |   1     |  数字:字体单位em，字符串：随便你写什么单位都行
isResizeAutoStyle | 是否监听屏幕变化，自动修改响应式样式 | Boolean | false | 监听屏幕变化，100ms ，响应式修改样式
|||| 盒子属性  boxStyle:{}
boxStyle.bg | 滑块背景颜色 | String | #e5e5e5 | 颜色名称，RGB，RGBA，16进制
boxStyle.barBg | 滑块进度背景颜色 | String | #5abc3c | 颜色名称，RGB，RGBA，16进制
boxStyle.radius | 滑块盒子 圆角 | Number/String | 0 | 数字:单位px，字符串：同 css border-radius
boxStyle.borderWidth | 滑块盒子 边框宽度 | Number/String | 0 | 数字:单位px
boxStyle.borderColor | 滑块盒子 边框颜色 | String | #333 | 颜色名称，RGB，RGBA，16进制
boxStyle.borderStyle | 滑块盒子 边框样式 | String | solid | 同 css border-style 属性值
|||| 按钮样式  btnStyle:{}
btnStyle.color | 按钮图标颜色 | String | #333 | 颜色名称，RGB，RGBA，16进制
btnStyle.succColor | 滑动完成按钮图标颜色 | String | #5abc3c | 颜色名称，RGB，RGBA，16进制
btnStyle.bg | 按钮背景颜色 | String | #fff | 颜色名称，RGB，RGBA，16进制
btnStyle.succBg | 滑动完成按钮背景颜色 | String | #fff | 颜色名称，RGB，RGBA，16进制
btnStyle.radius | 按钮圆角 | Number/String | null | 同 boxStyle.radius，不填写默认使用 boxStyle.radius
btnStyle.borderWidth | 按钮 边框宽度 | Number/String | 0 | 数字:单位px
btnStyle.borderColor | 按钮 边框颜色 | String | #333 | 颜色名称，RGB，RGBA，16进制
btnStyle.borderStyle | 按钮 边框样式 | String | solid | 同 css border-style 属性值
||||  getCompleteState:(res)=>{}
getCompleteState | 滑动完成返回方法 | function | function | 滑动完成，返回方法，res返回值  true/false



<br/>
<br/>



### 4、可用方法

1. 重置方法 ： `reset()`
2. 更新样式方法 ： `upStyle()` ，屏幕变化，会导致px样式无法完美还原样式，需要 这方法，重新设置px

列子
```js
 var box = new sliderVerif("#box");
 box.reset();
 box.upStyle();
```



