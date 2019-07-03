;(function ($) {

    const direction = {
        left: 0,
        right: 1
    };


    /**
     * 插件的私有方法
     * 初始化
     * @param jq jquery 对象，和你使用$('#one')获得的对象是一样的
     */
    function init(jq) {
        initLayout(jq);
        initClick(jq);
        initPlay(jq);

    }

    /**
     * 初始化布局
     * @param jq
     */
    function initLayout(jq) {

        const area = getWidthAndHeight(jq);
        jq.css({
            'width': area.width + 'px',
            'height': area.height + 'px'
        });
        let content = jq.children('.km-carousel-content').eq(0);
        let len = content.children('.km-carousel-item').length;
        content.css({
            'width': area.width * (len + 2) + 'px',
            'height': area.height + 'px'
        });

        content.children('.km-carousel-item').each(function () {
            $(this).css({
                'width': area.width + 'px',
                'height': area.height + 'px'
            });
        });

        if (len >= 2) {
            let f = content.children('.km-carousel-item').first().clone();
            let l = content.children('.km-carousel-item').last().clone();
            content.append(f.get(0));
            content.prepend(l.get(0));
        }
        content.css({
            left: -1 * area.width + 'px'
        });


        initChange(jq, len, area.width);

        if( jq.config.showBtn ){
            initBtn(jq, area.width);
        }

        jq.config.currIndex = 0;
    }


    /**
     * 初始化 切换按钮
     * @param jq jq
     * @param len item 数量
     * @param width 宽度
     */
    function initChange(jq, len, width) {
        let div = $('<div>')
            .attr('class', 'km-carousel-change-box');
        div.css({
            'width': width + 'px'
        });
        let ul = $('<ul>')
            .attr('class', 'km-carousel-change');
        for (let i = 0; i < len; i++) {
            let li = $('<li>');
            li.append(
                $('<a>')
                    .attr('href', 'javascript:void(0);')
                    .get(0)
            );
            if (0 === i) {
                li.attr('class', 'active');
            }
            ul.append(li.get(0));
        }
        div.append(ul.get(0));
        jq.append(div.get(0));
    }

    /**
     * 初始化 左右按钮
     * @param jq jq
     * @param width 宽度
     */
    function initBtn(jq, width) {
        let div = $('<div>')
            .attr('class', 'km-carousel-btn-box')
            .css({
                'width': width + 'px'
            });
        div.append(
            $('<button>')
                .attr('class', 'km-carousel-btn left')
                .html('&lt;')
                .get(0)
        );
        div.append(
            $('<button>')
                .attr('class', 'km-carousel-btn right')
                .html('&gt;')
                .get(0)
        );
        jq.append(div.get(0));
    }

    /**
     * 初始化点击事件
     * @param jq jq
     */
    function initClick(jq) {
        // 切换按钮
        jq.children('.km-carousel-change-box')
            .children('.km-carousel-change')
            .children('li')
            .each(function (index) {
                let item = $(this);
                item.on('click', function () {
                    if (index !== jq.config.currIndex) {
                        moveItemByChange(jq, index);
                    }
                });
            });

        // 左右按钮
        jq.children('.km-carousel-btn-box')
            .children('.km-carousel-btn')
            .each(function (index) {
                $(this).on('click', function () {
                    if (0 === index) {
                        moveItemByBtn(jq, direction.left);
                    } else {
                        moveItemByBtn(jq, direction.right);
                    }
                });
            });
    }

    /**
     * 初始化自动播放
     * @param jq jq
     */
    function initPlay(jq) {
        jq.mouseenter(function () {
            // 鼠标进入时停止
            jq.config.startPlay = false;
        }).mouseleave(function () {
            // 鼠标移开是播放
            jq.config.startPlay = true;
        });
        if( jq.config.autoPlay ){
            setInterval(function () {
                if( jq.config.startPlay){
                    moveItemByChange(jq, jq.config.currIndex + 1)
                }
            },2000);


        }
    }

    /**
     * 切换
     * @param jq jq
     * @param index 第几个
     */
    function moveItemByChange(jq, index) {
        const area = getWidthAndHeight(jq);
        let content = jq.children('.km-carousel-content').eq(0);
        let len = content.children('.km-carousel-item').length - 2;

        if (index < 0) {
            content.animate({
                left: '0px'
            }, 300);
            jq.config.currIndex = len - 1;
            changeBtnSelect(jq,jq.config.currIndex);
            content.animate({
                left: area.width * len * -1 + 'px'
            },0);
            return;
        }

        if (index >= len) {
            content.animate({
                left: area.width * (len + 1) * -1 + 'px'
            }, 300);
            jq.config.currIndex = 0;
            changeBtnSelect(jq,jq.config.currIndex);

            content.animate({
                left: area.width * -1 + 'px'
            },0);
            return;
        }
        let arr = getDistanceArray(len, area.width);

        changeBtnSelect(jq,index);


        content.animate({
            left: arr[index] + 'px'
        }, 300);

        jq.config.currIndex = index;

    }

    /**
     * 左右按钮切换
     * @param jq jq
     * @param d 方向
     */
    function moveItemByBtn(jq, d = direction.left) {
        if (d === direction.left) {
            moveItemByChange(jq, jq.config.currIndex - 1)
        } else {
            moveItemByChange(jq, jq.config.currIndex + 1)
        }
    }

    /**
     * 计算位置数组
     * @param len 共多少个item
     * @param width 每个item的宽度
     * @returns {Array}
     */
    function getDistanceArray(len, width) {
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr[i] = (i + 1) * width * -1;
        }
        return arr;
    }

    /**
     * 获取宽度和高度
     * @param jq jq
     * @returns {{width: *, height: *}}
     */
    function getWidthAndHeight(jq){
        let p = jq.parent();
        let width = p.width();
        let height = p.height();
        return {
            width : width,
            height : height
        };
    }

    /**
     * 选中切换按钮
     * @param jq
     * @param index
     */
    function changeBtnSelect(jq,index){
        jq.children('.km-carousel-change-box')
            .children('.km-carousel-change')
            .children('li')
            .eq(index)
            .addClass('active')
            .siblings()
            .removeClass('active');
    }


    /**
     * 插件实现代码
     * @param options 如果是json对象，则创建[初始化]插件，如果是字符串，则用来调用插件的公开方法
     * @param param 当前options是字符串时，代表传递给插件公开方法的参数。当然，你可以不传
     * @returns {*}
     */
    $.fn.kmCarousel = function (options, param) {
        // 如果是方法调用
        if (typeof options === 'string') {
            return $.fn.kmCarousel.methods[options](this, param);
        }

        // 获得配置，这里为了得到用户的配置项，覆盖默认配置项，并保存到当前jquery插件实例中
        let _opts = $.extend({}, $.fn.kmCarousel.defaults, options);
        let jq = this;
        jq.config = _opts;

        // 链式调用
        return this.each(function () {
            // console.log(this);
            // 调用私有方法，初始化插件
            init(jq);
        });
    };


    /**
     * 插件的公开方法
     */
    $.fn.kmCarousel.methods = {
        options: function (jq) {
            // 这个就不需要支持链式调用了
            return jq.config;
        }
    };


    /**
     * 插件的默认配置
     */
    $.fn.kmCarousel.defaults = {
        autoPlay : true,
        startPlay : true,
        showBtn : true
    };
})(jQuery, window, document);