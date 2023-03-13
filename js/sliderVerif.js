; (function (win) {
    "use strict";
    var _this = null;
    // 内部方法 insertEleStr：插入对象   options:参数
    var sliderVerification = function (insertEleStr = "", options = {}) {
        if (!insertEleStr) throw "insertEleStr 无效，请填写插入父级类名或ID";

        _this = this;

        // 参数
        this.options = {
            sliderText: "请按住滑块拖动",// 滑块提示文字
            succText: "验证通过",// 滑块完成提示文字
            sliderTextColor: "#666",//滑块提示文字颜色  颜色名称，RGB,RGBA,16进制
            succTextColor: "#fff",//滑块完成提示文字颜色  颜色名称，RGB,RGBA,16进制
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
            getCompleteState: (res) => { },
            ...options
        };

        // 内置变量
        this.isComplete = false;//是否完成
        this.step = 15;//步长，回到原点的速度

        // 滑块整体对象
        this._slider_verif_ = null;
        // 滑块
        this._slider_bar = null;
        // 塞入位置的父级元素
        this.insertEle = document.querySelector(insertEleStr);
        if (!this.insertEle) throw '获取 insertEleStr：插入对象 失败'
        // 初始化
        this.init();


        // 监听屏幕变化
        this.resizeTimer = null;
        if (this.options.isResizeAutoStyle) {
            win.addEventListener("resize", () => {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => {
                    this.upStyle();
                }, 100)
            })
        };
    };
    // 原型链  
    sliderVerification.prototype = {
        // 初始化
        init() {
            // 创建 html
            this.create();
            // 创建css
            this.createCss();
            // 添加事件
            this.addEvent();
        },
        // 创建 html
        create() {
            // <div class="_slider_verif_" id="_slider_verif_">
            //     <span>请按住滑块拖动</span>
            //     <div class="_slider_bar">
            //         <div class="_slider_span">
            //             <span>请按住滑块拖动</span>
            //         </div>
            //         <p class="_slider_btn"></p>
            //     </div>
            // </div>

            // 创建元素
            var _slider_verif_ = document.createElement("div");
            _slider_verif_.className = "_slider_verif_";
            _slider_verif_.innerHTML = `
                <span>${this.options.sliderText}</span>
                <div class="_slider_bar">
                    <div class="_slider_span">
                        <span>${this.options.sliderText}</span>
                    </div>
                    <p class="_slider_btn"></p>
                </div>
            `;

            // 塞入
            this.insertEle.appendChild(_slider_verif_);
            // 保存 对象
            this._slider_verif_ = _slider_verif_;
            this._slider_bar = _slider_verif_.querySelector("._slider_bar");
        },
        // 创建css
        createCss() {
            // 获取 父级 高宽
            var insertEleStrW = this.insertEle.clientWidth;
            var insertEleStrH = this.insertEle.clientHeight;

            // 设置 盒子 样式
            var boxStyle = JSON.parse(JSON.stringify(this.options.boxStyle || {}));
            // 判断圆角，设置单位
            boxStyle.radius = typeof boxStyle.radius == 'number' ? boxStyle.radius += 'px' : boxStyle.radius;
            // 判断边框宽度，设置单位
            boxStyle.borderWidth = typeof boxStyle.borderWidth == 'number' ? boxStyle.borderWidth += 'px' : boxStyle.borderWidth;


            // 设置 按钮 样式
            var btnStyle = JSON.parse(JSON.stringify(this.options.btnStyle || {}));
            // 判断边框宽度，设置单位
            btnStyle.borderWidth = typeof btnStyle.borderWidth == 'number' ? btnStyle.borderWidth += 'px' : btnStyle.borderWidth;
            // 判断 圆角 ，设置单位
            switch (typeof btnStyle.radius) {
                case 'number':// 数字  ,添加单位
                    btnStyle.radius += 'px';
                    break;
                case 'string': // 字符串，不需要动
                    btnStyle.radius = btnStyle.radius;
                    break;
                default: // unll undefined , 没有设置，就是用 盒子 boxStyle.radius 属性
                    btnStyle.radius = boxStyle.radius;
                    break;
            };


            // 设置字体
            var fontSize = this.options.fontSize;
            typeof fontSize == 'number' ? fontSize += 'em' : fontSize;


            var css = `
                ._slider_verif_ {
                    /* 盒子宽度，设置bar>span宽度 */
                    --slider_verif_wid: ${insertEleStrW || 0}px;
                    /* 盒子高度，设置按钮高度 */
                    --slider_verif_hei: ${insertEleStrH || 0}px;
                    /* 滑动前 文字颜色 */
                    --slider_text_color: ${this.options.sliderTextColor};
                    /* 滑动完成 文字颜色 */
                    --slider_succ_text_color: ${this.options.succTextColor};
                    /* 字体大小 */
                    --slider_fontsize:${fontSize};
                    
                    /* 盒子 样式 */
                    --slider_verif_bg:${boxStyle.bg};
                    --slider_verif_barbg:${boxStyle.barBg};
                    --slider_verif_radius: ${boxStyle.radius};
                    --slider_verif_border_w:${boxStyle.borderWidth};
                    --slider_verif_border_c:${boxStyle.borderColor};
                    --slider_verif_border_s:${boxStyle.borderStyle};


                    /* 按钮 样式 */
                    --slider_btn_color:${btnStyle.color};
                    --slider_btn_succColor:${btnStyle.succColor};
                    --slider_btn_bg:${btnStyle.bg};
                    --slider_btn_succBg:${btnStyle.succBg};
                    --slider_btn_radius: ${btnStyle.radius};
                    --slider_btn_border_w:${btnStyle.borderWidth};
                    --slider_btn_border_c:${btnStyle.borderColor};
                    --slider_btn_border_s:${btnStyle.borderStyle};
                }
                

                @font-face {
                    font-family: "iconfont";
                    src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAMIAA0AAAAABygAAAKyAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cGh4GYACCShEICoFwgWILDAABNgIkAxIEIAWFAgdLGyYGyB6D424JUXIvS0xRipjmc/URkszy0Lcfvzuz+8W9pO/NnGqRTCOS4HRNhUSopp0S3v+/n7sPbxNviHsVTZu//yeiCbdmYtUqibNIowGHmf9NXJP/WzCa3yWWTa9LTZu9TSOBBrbXRVOFJQ9sN7AHG/KQ5zam0yMOi2hw3sArRDpZ6Tsh4PPSWhTgH6VVa1wboRujQApFFSoStYpXWsgXGfASfD7+y40oUkthvNzJowYZ3AUheFxooPziRwBgHkJBwTQE9oQKTAuzDrSqQiYSbwalJguvSTeFaCUAkUj45wngidEsQQvoRMUh8BCACoCUA3QGzdX/Ddz/Ce/7gge+fineXLx5SpZ1brxcvU/pWH9NY6o6Jv3M9om+jQCnq3Nqbn51dVlsnhjY7I+Oa+AvNDqcjYsXjUsrf+hiUUTD0kXDoswDrWoau76aHh0tldCq6xFtaJi2R8uD4qefH5fLl80sdcddHcWgDXdSOjoio5xcV2d+AAgE3bMzx0JK+X97V1WjV6tpboqlAUC7BEEt7P2gApSPvAhqxf8SlW1/gNBiWQhIdOpEA2DQDyDAkGQIhHZHEEhtHkOgaPdcgKrdawFadPkgQKt2PwGBTltRDgh0GYoRRdQOrALJhn7lbOp1zRb9dEBF+tgWo5bZVv3e2U5Xfqd1WQ051DHCxMwWy0STcEgVpHS0iAYz2F1Xezm1Fy4DARz2S+EMRrJQEzOCL9T0+tcPpVcwIxNFabQcmbLB4qvznMzssMBhdy3MWMVLTKxIuczMCNEIRjoa0Rrj6IepqelE0zu/o4RJmWWCnftsk5XMNZuJ5Zp6SVWdNdm/89UAniRvTK9UlixEwlomaZY+mE37iNDqcOTo5yrRyQ5uQcjIKO3P5FhLGiyY5dBZ7AqxljTJLRNTKn594bYAAAA=') format('woff2'),
                        url('data:font/woff;charset=utf-8;base64,d09GRgABAAAAAATwAA0AAAAABygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAE1AAAABoAAAAclcLL5UdERUYAAAS0AAAAHgAAAB4AKQALT1MvMgAAAaAAAABGAAAAYDw1SYRjbWFwAAAB/AAAAEUAAAFK53/pCmdhc3AAAASsAAAACAAAAAj//wADZ2x5ZgAAAlAAAADcAAAA8GPgCUNoZWFkAAABMAAAADAAAAA2I0Ho3GhoZWEAAAFgAAAAHQAAACQHoQOFaG10eAAAAegAAAARAAAAEgzuAEFsb2NhAAACRAAAAAwAAAAMADwAeG1heHAAAAGAAAAAHgAAACABEQAwbmFtZQAAAywAAAFGAAACgl6CAQJwb3N0AAAEdAAAADcAAABLFSV17XjaY2BkYGAAYhm5yV/j+W2+MnCzMIDAA/6gPDjt+H8f82FmVyCXg4EJJAoAEJ4J53jaY2BkYGBu+N/AEMPCAALMhxkYGVABCwBVbwMvAAAAeNpjYGRgYGBlUGFgYgABEMkFhAwM/8F8BgAMgwFCAAB42mNgYWFgnMDAysDA1Ml0hoGBoR9CM75mMGLkAIoysDIzYAUBaa4pDAeeMTzbytzwv4GBgfkOA5BkYERSosDACAB3IQ00AAB42mNhgAAWCHZkeAcAAksBPAAAAHjaY2BgYGaAYBkGRgYQcAHyGMF8FgYNIM0GpBkZmJ4xPNv6/z8DA4SWYpb0h6oHAkY2BjiHkQlIMDGgAkaGYQ8AZJ0KUwAAAAAAAAAAAAAAADwAeHjaY2BicPy/j/kwsyuDAIMSAwOjkRyTCB+Tkh6TiR0Tox2jGhs7o7oeIx+jPKOYmTk7E1Ps4ip396rFu5ZUublVLWEsF2JSNRX6dz9FyFSVUahfyEaIhdnVvXrJrqXV7u7VS3ctqXb/N1nIXJVR+N/9ZCFGVSOhCUKMQiwMDEwM7xiamSWZGhiEGJSB9oqLifAzsimpmdiD7LNjEmNFFlEzMTNitLzCw3OFR1mSZ+tWDnY2QTExRg6ECI+kMlPhZR4Vnss8Esq8QBVi4gJsbJxIIrzKEgwMAMvBNGp42n2QzUrDQBSFz/RPbUHEgutZFUFIf5alu0LduXBR1206SVuSTJhMC126deUDuPUxfACfQXDlg3garwgVmpDLN+fec2YmAC7xCYWfp41rYYVT3AlXcIJYuEr9UbhGfhGuo4U34Qb1D+EmbtRIuIW2emaCqp1x1SnT9qxwgZFwBed4EK5St8I18pNwHVd4FW5QfxduYoov4RY6aokxHAxm8KwLaMyxY10hZG6GqKweGDsz82ah5zu9Cm0W2Yziv6m/1j3jYmyQMNpxaeJNMnNHLUdaU6Y5FBzZtzT6CNCjbFyxspnuB72j9lvaszLi8J4FtjzmgKqnUfNztKekicQYXiEha+Rlb00lpB4w1mTG/f6VYhsPvI905GyqJ9zWJInVubNrE3oOL8s9cgzR5RsdpAfl4VOOeZ8Pu91IAoLQpvgGD2pwhwAAeNpjYGKAAC4wyciADljBokyMTIzMHFUZqXnphaWpopX5pRWZiXnpxRmlQDILyCzJLwUAxfwMlQAAAAAB//8AAgABAAAADAAAABYAAAACAAEAAwAEAAEABAAAAAIAAAAAeNpjYGBgZACCq0vUOUD0A/6gPBgNADdBBQgAAA==') format('woff'),
                        url('data:font/ttf;charset=utf-8;base64,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') format('truetype');
                }

                ._slider_verif_ *{
                    margin: 0;
                    padding: 0;
                }
                ._slider_verif_{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    box-sizing: border-box;
                    overflow: hidden;
                    user-select: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 1px solid #333;
                    color: #666;
                    border-radius: var(--slider_verif_radius);
                    border-width: var(--slider_verif_border_w);
                    border-style: var(--slider_verif_border_s);
                    border-color: var(--slider_verif_border_c);
                    background-color: var(--slider_verif_bg);
                    color:var(--slider_text_color);
                }
                ._slider_verif_ span{
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1em;
                    font-size: var(--slider_fontsize);
                }
                ._slider_verif_ ._slider_bar{
                    position: absolute;
                    z-index: 5;
                    width: 0;
                    min-width:var(--slider_verif_hei);
                    height: 100%;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    color: #fff;
                    background-color:#5abc3c;
                    color:var(--slider_succ_text_color);
                    border-radius: var(--slider_btn_radius);
                    background-color:var(--slider_verif_barbg);
                }
                ._slider_bar ._slider_span{
                    width: var(--slider_verif_wid);
                    height: 100%;
                    position: relative;
                }
                ._slider_btn{
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    right: 0;
                    width: var(--slider_verif_hei);
                    height: 100%;
                    cursor: pointer;
                    border: 1px solid #e5e5e5;
                    box-sizing: border-box;
                    color: #666;
                    font-size: 1.5em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: "iconfont";
                    background-color: #fff;
                    background-color: var(--slider_btn_bg);
                    border-radius: var(--slider_btn_radius);
                    border-width: var(--slider_btn_border_w);
                    border-style: var(--slider_btn_border_s);
                    border-color: var(--slider_btn_border_c);
                }
                ._slider_btn::before{
                    content: "\\e6b5";
                    color:var(--slider_btn_color);
                }
                /* 完成样式 */
                ._slider_verif_._slider_verif_complete ._slider_btn{
                    background-color: var(--slider_btn_succBg);
                }
                ._slider_verif_._slider_verif_complete ._slider_btn::before{
                    content: "\\e600";
                    color:var(--slider_btn_succColor);
                }
            `;


            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = "_slider_verif_";
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            document.head.appendChild(style);
        },
        // 添加 事件
        addEvent() {
            var _slider_btn = this._slider_verif_.querySelector("._slider_btn");
            // pc，拖动事件
            _slider_btn.addEventListener("mousedown", this.btnMousedown);
            // 移动，触摸 拖动事件
            _slider_btn.addEventListener("touchstart", this.btnTouchstart);
        },
        // 按钮按下事件,鼠标
        btnMousedown(e) {
            e.preventDefault();
            // 判断是否完成
            if (_this.isComplete) return;
            var insertEleStrW = _this.insertEle.clientWidth;
            // 点击位置
            var clientX = e.clientX;


            // 拖动
            document.onmousemove = (e) => {
                // 移动距离
                var move = e.clientX - clientX;

                // 判断 移动距离是否达到 最大
                if (move >= insertEleStrW) {
                    move = insertEleStrW;
                };
                // 设置样式
                _this._slider_bar.style.width = move + "px";
                // 判断 是否完成
                if (move >= insertEleStrW) {
                    _this.slideComplete();
                    btnUp();
                };
            };
            // 松开鼠标
            document.onmouseup = (e) => {
                btnUp();
            };

            var btnUp = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                // 判断是否未完成
                if (!_this.isComplete) {
                    // 回到原点
                    _this.backOrigin(_this.step);
                };
                btnUp = null;
            };
        },
        // 按钮按下事件，触摸
        btnTouchstart(e) {
            e.preventDefault();
            // 判断是否完成
            if (_this.isComplete) return;
            var insertEleStrW = _this.insertEle.clientWidth;
            // 点击位置
            var clientX = e.touches[0].clientX;

            // 拖动
            document.ontouchmove = (e) => {
                // 移动距离
                var move = e.touches[0].clientX - clientX;

                // 判断 移动距离是否达到 最大
                if (move >= insertEleStrW) {
                    move = insertEleStrW;
                };
                // 设置样式
                _this._slider_bar.style.width = move + "px";
                // 判断 是否完成
                if (move >= insertEleStrW) {
                    _this.slideComplete();
                    btnUp();
                };
            };
            // 松开鼠标
            document.ontouchend = (e) => {
                btnUp();
            };

            var btnUp = () => {
                document.ontouchmove = null;
                document.ontouchend = null;
                // 判断是否未完成
                if (!_this.isComplete) {
                    // 回到原点
                    _this.backOrigin(_this.step);
                };
                btnUp = null;
            };
        },
        // 回到原点 
        backOrigin(step) {
            var wid = this._slider_bar.clientWidth;//宽度
            var btn_w = this._slider_verif_.querySelector("._slider_btn").offsetWidth;

            wid = wid - step;

            // 最小位置是 在 按钮宽度位置
            if (wid - btn_w <= 0) wid = 0;


            this._slider_bar.style.width = wid + 'px';

            if (wid <= 0) {
                // 可以继续滑动
                this.isComplete = false;
            } else {
                step--;
                if (step <= 8) step = 8;
                setTimeout(() => {
                    this.backOrigin(step);
                }, 2);
            };
        },
        // 滑动完成
        slideComplete() {
            this.isComplete = true;
            // 添加完成类
            this._slider_verif_.classList.add("_slider_verif_complete");
            // 修改 提示文字
            this.modifyUpText(this.options.succText);
            // 返回完成状态
            this.options.getCompleteState(true);
        },
        // 修改 上层提示文案
        modifyUpText(text) {
            var span = this._slider_bar.querySelector("._slider_span").querySelector("span");
            span.innerText = text;
        },
        // 销毁
        destroy() {
            this._slider_verif_.remove();
            clearTimeout(this.resizeTimer);
        },
        // 重置
        reset() {
            this.modifyUpText(this.options.sliderText);
            this.backOrigin(this.step);
            // 移除完成类
            this._slider_verif_.classList.remove("_slider_verif_complete");
        },
        // 更新样式(屏幕变化)
        upStyle() {
            // 获取 父级 高宽
            var insertEleStrW = this.insertEle.clientWidth;
            var insertEleStrH = this.insertEle.clientHeight;
            // 只需要更新 的 css变量
            this._slider_verif_.style.setProperty("--slider_verif_wid", insertEleStrW + 'px');
            this._slider_verif_.style.setProperty("--slider_verif_hei", insertEleStrH + 'px');
            // 进度
            this._slider_bar.style.width = '100%';
        },
    };


    // 外部方法,单列模式
    var sliderVerif = null;
    var sliderVerifFunc = function (insertEleStr = "", options = {}) {
        if (sliderVerif) sliderVerif.destroy();
        sliderVerif = new sliderVerification(insertEleStr, options);
    };
    // 重置
    sliderVerifFunc.prototype.reset = function () {
        sliderVerif.reset();
    };
    // 更新样式
    sliderVerifFunc.prototype.upStyle = function () {
        sliderVerif.upStyle();
    };

    // import 抛出
    if (typeof module !== 'undefined' && module.exports) module.exports = sliderVerifFunc;
    // window 抛出
    win.sliderVerif = sliderVerifFunc;
})(window);