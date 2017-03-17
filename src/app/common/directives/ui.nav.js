(function () {
    'use strict';

    angular.module('iot.ui.directives')
        .directive('uiNav', ['$timeout', function ($timeout) {
            return {
                restrict: 'AC',
                link: function (scope, el, attr) {
                    var _window = $(window),
                        _mb = 768,
                        wrap = $('.app-aside'),
                        next,
                        backdrop = '.dropdown-backdrop';
                    //导航里除了第一个li，每个li下面加入一条黑色边框，仪表盘li还要加上上边框
                    $('nav[ui-nav]>ul>li').eq(1).css({
                        'borderTop': '1px solid #1E2434'
                    });
                    $('nav[ui-nav]>ul>li').not(':first').each(function() {
                        $(this).css({
                            'borderBottom': '1px solid #1E2434'
                        });
                    });
                    //首先默认给‘仪表盘’添加蓝色细线
                    var $blueLine = $('<div id="blueLine" style="width:4px;height:100%;background-color:#25A6F7;position:absolute;top:0;"></div>');
                    $( $('nav[ui-nav]>ul>li')[1] ).append( $blueLine );
                    // unfolded
                    el.on('click', 'a', function (e) {
                        var _this = $(this);
                        var $parentLi = _this.parent()[0];

                        //首先删除所有蓝色细线
                        removeAllBlueLines();
                        next && next.trigger('mouseleave.nav');

                        _this.parent().siblings(".active").toggleClass('active');
                        _this.next().is('ul') && _this.parent().toggleClass('active') && e.preventDefault();
                        // mobile
                        _this.next().is('ul') || ((_window.width() < _mb) && $('.app-aside').removeClass('show off-screen'));
                        //左边加入蓝色竖线
                        addBlueLine();

                        function addBlueLine() {
                            $($parentLi).css({
                                position: 'relative'
                            });
                            $blueLine.appendTo( $parentLi );
                        }

                        function removeAllBlueLines() {
                            $('#blueLine').each(function() {
                                $(this).remove();
                            });
                        }
                        
                    });

                    // folded & fixed
                    el.on('mouseenter', 'a', function (e) {
                        next && next.trigger('mouseleave.nav');
                        $('> .nav', wrap).remove();
                        if (!$('.app-aside-fixed.app-aside-folded').length || (_window.width() < _mb) || $('.app-aside-dock').length) return;
                        var _this = $(e.target)
                            , top
                            , w_h = $(window).height()
                            , offset = 50
                            , min = 150;

                        !_this.is('a') && (_this = _this.closest('a'));
                        if (_this.next().is('ul')) {
                            next = _this.next();
                        } else {
                            return;
                        }

                        _this.parent().addClass('active');
                        top = _this.parent().position().top + offset;
                        next.css('top', top);
                        if (top + next.height() > w_h) {
                            next.css('bottom', 0);
                        }
                        if (top + min > w_h) {
                            next.css('bottom', w_h - top - offset).css('top', 'auto');
                        }
                        next.appendTo(wrap);

                        next.on('mouseleave.nav', function (e) {
                            $(backdrop).remove();
                            next.appendTo(_this.parent());
                            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
                            _this.parent().removeClass('active');
                        });

                        $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function (next) {
                            next && next.trigger('mouseleave.nav');
                        });

                    });

                    wrap.on('mouseleave', function (e) {
                        next && next.trigger('mouseleave.nav');
                        $('> .nav', wrap).remove();
                    });
                }
            };
        }]);


})();
