document.addEventListener('DOMContentLoaded', function(){
    //TODO 即時関数いらない
    //window.tnkはローカル変数にしちゃった方がいい
    //windowもローカル変数
    (function(){
        if (!window.tnk.isDebug){
            window.tnk.log = function(){};
        }
    })();

    //内部以外のPCからのアクセスはリダイレクト
    (function(){
        var innerAccess = document.querySelector('#innerAccess');
        if (!innerAccess) {
            innerAccess = document.createElement('input');
            innerAccess.value = 'false';
        }

        if ((!window.tnk.isDebug && innerAccess.value === 'false') &&
            !(window.ontouchstart !== undefined && window.orientation !== undefined)) {
            location.assign('/pc/index.html');
        }
    })();

    //tokenの設定
    if ('__token' in window) {
        switch (typeof __token) {
            case 'string':
                if (__token) {
                    window.tnk.__token = __token;
                } else {
                    window.tnk.__token = '';
                }
                break;
            case 'object':
                if (__token) {
                    window.tnk.__token = __token.value;
                } else {
                    window.tnk.__token = '';
                }
                break;
            default:
                window.tnk.__token = '';
                break;
        }
    }

    _g.log('token value(onload): ' + window.tnk.__token);

    _g.initLink();

    //バナークリック数カウント用Google Analytics処理
    _g.initLinkBanner();

    //画像プリロード
    if('preLoadImage' in window){
        var preLoadImageObj = new Image();
        preLoadImageObj.src = _g.imageServerPath + preLoadImage;
    }

    // global footer の調整
    _g.arrangeGlobalFooter();

    //アンカーが指定されていなければアドレスバー隠す
    if (!location.hash) {
        //iPhoneでアドレスバー隠す
        setTimeout(function () {
            scrollTo(0, 1);
        }, 100);
    }

});

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2011-06-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

    (function (view) {

        "use strict";

        var
        classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
        objCtr = Object,
        strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
        },
        arrIndexOf = Array[protoProp].indexOf || function (item) {
            var
            i = 0,
            len = this.length;
            for (; i < len; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        },
        // Vendors: please allow content code to instantiate DOMExceptions
        DOMEx = function (type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        },
        checkTokenAndGetIndex = function (classList, token) {
            if (token === "") {
                throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
            }
            if (/\s/.test(token)) {
                throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }
            return arrIndexOf.call(classList, token);
        },
        ClassList = function (elem) {
            var
            trimmedClasses = strTrim.call(elem.className),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;
            for (; i < len; i++) {
                this.push(classes[i]);
            }
            this._updateClassName = function () {
                elem.className = this.toString();
            };
        },
        classListProto = ClassList[protoProp] = [],
        classListGetter = function () {
            return new ClassList(this);
        };
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function (token) {
            token += "";
            if (checkTokenAndGetIndex(this, token) === -1) {
                this.push(token);
                this._updateClassName();
            }
        };
        classListProto.remove = function (token) {
            token += "";
            var index = checkTokenAndGetIndex(this, token);
            if (index !== -1) {
                this.splice(index, 1);
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token) {
            token += "";
            if (checkTokenAndGetIndex(this, token) === -1) {
                this.add(token);
            } else {
                this.remove(token);
            }
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get:classListGetter, enumerable:true, configurable:true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }

    }(self));

}


if (!window.tnk) {
    window.tnk = {};
}
window.tnk.useNewOnFastClick = false; // 新しい onFastClick を使う場合は true に

/**
 * iOS/Androidのclickイベント遅延問題対策
 * @param callback
 */
if (window.tnk.useNewOnFastClick) {
    Element.prototype.onFastClick = function(callback) {
        window.tnk.TapCheckerManager.addListener(this, callback);
    };
} else {
    Element.prototype.onFastClick = function(callback) {
        if ('addEventListener' in this) {
            this.addEventListener('click', callback, false);
        }
    };
}



(function(_g){
    _g.currentActiveDialogId = undefined;

    _g.imgRatioPath = (function(){
        if (window.devicePixelRatio === 2) {
            return '/ratio20';
        } else {
            return '/ratio10';
        }
    })();


    _g.useNewAjaxHandling = true; // 新しい ajax 処理を使うか？

    if (!_g.useNewAjaxHandling) {
        // 旧処理
        _g.activeAjaxCount = 0;
        _g.isAjaxProcessing = function(){
            return !(_g.activeAjaxCount === 0);
        };
    } else {
        // ajax 処理が何個走ってるかの管理
        _g.activeAjaxChecker = {
            activeAjaxCount: 0,
            activeAjax: {},
            add: function(ajax) {
                if (!(ajax in this.activeAjax)) {
                    this.activeAjax[ajax] = true;
                    this.activeAjaxCount++;
                    console.log('-- added ajax: total=' + this.activeAjaxCount);
                }
            },
            remove: function(ajax) {
                if (ajax in this.activeAjax) {
                    delete this.activeAjax[ajax];
                    this.activeAjaxCount--;
                    console.log('-- remove ajax: total=' + this.activeAjaxCount);
                }
            },
            isActive: function() {
                return !!this.activeAjaxCount;
            }
        };
        _g.isAjaxProcessing = function() {
            return _g.activeAjaxChecker.isActive();
        };
    }



    //登録系処理サブミット済み判定フラグ
    _g.isTokenSubmitted = false;

    _g.__token = '';

    //ajaxのタイムアウト時間
    if (!_g.useNewAjaxHandling) {
        _g._AJAX_TIMEOUT_DURATION = (function () {
            return 60 * 1000;
        })();
    } else {
        _g._AJAX_TIMEOUT_DURATION = 60 * 1000;
    }

    _g.dialogInitializer = {};

    _g.os = (function(){
        var ua = navigator.userAgent;
        return {
            ua: ua,
            pixelRatio: window.devicePixelRatio,
            ios: /ip(hone|od|ad)/i.test(ua),
            iphone: /iphone/i.test(ua),
            ipad: /ipad/i.test(ua),
            android: /android/i.test(ua),
            mobile: /android.+mobile|ip(hone|od|ad)/i.test(ua),
            isGS3: /android.+sc-06d/i.test(ua)          // Galaxy S3
        };
    })();

    _g.log = (function(){
        //TODO 正規表現はリテラルで
        //TODO window.tnkはローカル変数に
        var lineregex = new RegExp("\/([^\/]+?:[0-9]+):"),
        printlog = function(args) {
            var stack = new Error().stack;
            if (stack) {
                var lines = stack.split(/\n/);
                var line = lines[3];
                if (line) {
                    var linematch = lineregex.exec(line);
                    if (linematch) {
                        var match = linematch[1];
                        args.push('('+match+')');
                    }
                }
            }
            args.unshift('[GANG_LOG]');
            if (window.tnk.os.ios || window.tnk.os.android) {
                console.log(args.join(' '));
            } else {
                console.log.apply(console, args);
            }
        };
        return function(){
            printlog(Array.prototype.slice.apply(arguments));
        };
    })();

    _g.fillData = function(_target, _src) {
        var target = _target || {};

        for (var key in _src) {
            //TODO src.hasOwnProperty(key)でsrcのkeyのみに限定/ object.keys.src?
            if (typeof _src[key] === 'object') {
                if (!target.hasOwnProperty(key)){
                    //array.prototype.toString.call 平木さんのgithub見る
                    target[key] = (_src[key].constructor === Array) ? [] : {};
                }
                _g.fillData(target[key], _src[key]);
            } else {
                if (!target.hasOwnProperty(key)){
                    target[key] = _src[key];
                }
            }
        }

        return target;
    };

    /**
     * Ajax通信
     * @param url
     * @param options
     */
    if (_g.useNewAjaxHandling) {

        (function() {
            //////////////////////////////////////////////////
            // ajax 処理のコア
            _g.ajaxCore = function(url, options) {
                this.xhr = new XMLHttpRequest();
                this.xhrTimeout = null;
                this.defaultOptions = {
                    url: '',
                    type: 'POST',
                    data: {},
                    success: function(){},
                    error: function(){},
                    hideAjaxMask: false
                };
                this.url = url;
                this.options = options;
                if (this.check()) {
                    this.send();
                }
            };

            // オプションパラメータのチェック
            _g.ajaxCore.prototype.check = function() {
                // options だけが渡されている場合
                if (typeof this.url === 'object') {
                    this.options = this.url;
                    this.url = undefined;
                }

                this.options = this.options || {};
                this.options = _g.fillData(this.options, this.defaultOptions);
                if (!this.options.url && this.url) {
                    this.options.url = this.url;
                }
                return !!this.options.url;
            };

            // リクエストの送信
            _g.ajaxCore.prototype.send = function() {
                if (this.options.type === 'GET') {
                    if (this.options.data) {
                        this.options.url += '?' + _g.encodeHtmlForm(this.options.data);
                    }
                    _g.log(this.options.url);
                    if (!this.options.hideAjaxMask) { window.tnk.toggleAjaxMask(true); }

                    _g.activeAjaxChecker.add(this);
                    this.xhrTimeout = setTimeout(this.onAjaxTimeout(), _g._AJAX_TIMEOUT_DURATION);

                    this.xhr.open('GET', this.options.url, true);
                    this.xhr.onreadystatechange = this.onReadyStateChange();
                    this.xhr.send(null);
                    return true;
                } else if (this.options.type === 'POST') {
                    if (window.tnk.os.ios) { //iOS6 Mobile SafariがAjax POSTでキャッシュする問題を回避する方法
                        this.options.url += '?timestamp=' + new Date().getTime();
                    }
                    if (!this.options.hideAjaxMask) { window.tnk.toggleAjaxMask(true); }

                    _g.activeAjaxChecker.add(this);
                    this.xhrTimeout = setTimeout(this.onAjaxTimeout(), _g._AJAX_TIMEOUT_DURATION);

                    this.xhr.open('POST', this.options.url, true);
                    this.xhr.onreadystatechange = this.onReadyStateChange();
                    this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    _g.log('ajax url: ', this.options.url);
                    if (this.options.data) {
                        var dataQuery = _g.encodeHtmlForm(this.options.data);
                        _g.log('ajax param: ', dataQuery);
                        this.xhr.send(dataQuery);
                    } else {
                        this.xhr.send(null);
                    }
                    return true;
                }
                return false;
            };

            // タイムアウト処理（関数オブジェクトを返します）
            _g.ajaxCore.prototype.onAjaxTimeout = function() {
                var self = this;
                return function() {
                    _g.log('ajax timeout');
                    self.xhr.onreadystatechange = self.emptyFunc;
                    self.xhr.abort();
                    _g.activeAjaxChecker.remove(self);
                    if (!self.options.hideAjaxMask) { window.tnk.toggleAjaxMask(false); }
                    window.location.reload(); //タイムアウト時はリロードする ← ページがご破算だからこれだけで良くない？
                };
            };

            // this.xhr.onreadystatechange コールバック関数（関数オブジェクトを返します）
            _g.ajaxCore.prototype.onReadyStateChange = function() {
                var self = this;
                return function() {
                    if (self.xhr.readyState === 4) {
                        self.xhr.onreadystatechange = self.emptyFunc; // コールバック処理を潰します
                        if (self.xhrTimeout) { clearTimeout(self.xhrTimeout); }
                        _g.log('clear ajax timeout');

                        if (self.xhr.status === 200) {
                            var result = self.xhr.responseText;
                            _g.log(result);
                            try {
                                if (result.length > 0) {
                                    if (self.options.success) {
                                        self.options.success(result);
                                    }
                                } else {
                                    window.location.reload(); //戻り値が空だったらリロードする
                                }
                            } catch (e){
                                _g.log(e.stack);
                            }
                            _g.log('tnk.ajax callback finish');
                        } else {
                            if (self.options.error) {
                                self.options.error(self.xhr);
                            }
                        }

                        if (!self.options.hideAjaxMask) { window.tnk.toggleAjaxMask(false); }
                        _g.activeAjaxChecker.remove(self);
                    }
                };
            };

            // 空のコールバック関数
            _g.ajaxCore.prototype.emptyFunc = function() {};

        })(); // 定義終了

        _g.ajax = function(url, options) {
            var ajax = new _g.ajaxCore(url, options);
        };

    } else {
        _g.ajax = function(url, options) {
            var that = this;
            //即時呼び出し関数にすることで多重呼び出し可能になる？
            (function(url, options){
                var xhr = new XMLHttpRequest(),
                    xhrTimeout,
                encodeHtmlForm = function (data) {
                    var params = [];
                    for (var name in data) {
                        var value = data[ name ];
                        // TODO '+'演算子はケツにつけたほうがいい
                        var param = encodeURIComponent(name).replace(/%20/g, '+') +
                                    '=' + encodeURIComponent(value).replace(/%20/g, '+');
                        params.push(param);
                    }
                    return params.join('&');
                },
                onAjaxTimeout = function () {
                    _g.log('ajax timeout');
                    xhr.abort();
                    //that.isAjaxProcessing = false;
                    that.activeAjaxCount--;
                    if (!options.hideAjaxMask) window.tnk.toggleAjaxMask(false);
                    //タイムアウト時はリロードする
                    window.location.reload();
                },
                defaultOptions = {
                    url: '',
                    type: 'POST',
                    data: {},
                    success: function(){},
                    error: function(){},
                    hideAjaxMask: false
                };

                //that.isAjaxProcessing = true;
                that.activeAjaxCount++;

                if (typeof url === 'object') {
                    options = url;
                    url = undefined;
                }
                options = options || {};
                options = that.fillData(options, defaultOptions);
                if (!options['url'] && url) {
                    options['url'] = url;
                }


                xhr.onreadystatechange = function(){
                    if (xhr.readyState === 4) {
                        (function(){
                            _g.log('clear ajax timeout');
                            clearTimeout(xhrTimeout);   //タイムアウトを解除
                        })();
                        if (xhr.status === 200 || xhr.status === 0) {
                            var result = xhr.responseText;
                            _g.log(result);
                            try {
                                if (result.length > 0) {
                                    options.success(result);
                                } else {
                                    //戻り値が空だったらリロードする
                                    window.location.reload();
                                }
                            } catch (e){
                                _g.log(e.stack);
                            }
                            _g.log('tnk.ajax callback finish');
                            if (!options.hideAjaxMask) window.tnk.toggleAjaxMask(false);
                            //that.isAjaxProcessing = false;
                            _g.activeAjaxCount--;
                        } else {
                            if (options.error) {
                                options.error(xhr);
                            }
                            if (!options.hideAjaxMask) window.tnk.toggleAjaxMask(false);
                            //that.isAjaxProcessing = false;
                            that.activeAjaxCount--;
                        }
                    }
                };
                if (!options.url) {
                    //that.isAjaxProcessing = false;
                    that.activeAjaxCount--;
                    return; // 戻り値はどこにも使われていない
                }
                xhrTimeout = setTimeout(onAjaxTimeout, that._AJAX_TIMEOUT_DURATION);
                if (options.type === 'GET') {
                    if (options.data) {
                        options.url += '?' + encodeHtmlForm(options.data);
                    }
                    _g.log(options.url);
                    if (!options.hideAjaxMask) window.tnk.toggleAjaxMask(true);
                    xhr.open('GET', options.url, true);
                    xhr.send(null);
                } else if (options.type === 'POST') {
                    if (!options.hideAjaxMask) window.tnk.toggleAjaxMask(true);

                    //iOS6 Mobile SafariがAjax POSTでキャッシュする問題を回避する方法
                    if (window.tnk.os.ios) {
                        options.url += '?timestamp=' + (new Date()).getTime().toString();
                    }

                    xhr.open('POST', options.url, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    _g.log('ajax url: ', options.url);
                    if (options.data) {
                        var dataQuery = encodeHtmlForm(options.data);
                        _g.log('ajax param: ', dataQuery);
                        xhr.send(dataQuery);
                    } else {
                        xhr.send(null);
                    }
                }
            })(url, options);
        };
    }

    /**
     * ajaxでJSONを取得(window.tnk.ajaxのラッパー)
     * tokenが存在したら自動でパラメータに追加
     * @param url
     * @param options
     */
    _g.ajaxJSON = function(url, options) {
        var that = this,
        defaultOptions = {
            url: '',
            type: 'POST',
            data: {},
            success: function(){},
            error: function(){},
            hideAjaxMask: false,
            isUpdate: true
        };
        if (typeof url === 'object') {
            options = url;
            url = undefined;
        }
        options = options || {};
        options = that.fillData(options, defaultOptions);
        if (!options['url'] && url) {
            options['url'] = url;
        }
        if (options.isUpdate) {
            options.data.token = that.__token;
        }
        that.ajax(url, {
            url: options.url,
            type: options.type,
            data: options.data,
            success: function(result) {
                var resultJson = JSON.parse(result);
                if (resultJson.token) {
                    if (typeof resultJson.token === 'string') {
                        that.__token = resultJson.token;
                    }
                }
                _g.log('token value(after ajax): ' + window.tnk.__token);
                if (resultJson.resultStatus.toLowerCase() === 'success') {
                    options.success(resultJson);
                } else {
                    that.handleJSONError(resultJson);
                }
            },
            error: function(xhr) {
                if (options.error) options.error(xhr);
            },
            hideAjaxMask: options.hideAjaxMask
        });
    };

    /**
     * GETでJSONを取得(window.tnk.ajax()のラッパー)
     * @param url
     * @param options
     */
    _g.getJSON = function (url, options) {
        var that = this,
        defaultOptions = {
            url: '',
            success: function(){},
            error: function(){},
            hideAjaxMask: false
        };
        if (typeof url === 'object') {
            options = url;
            url = undefined;
        }
        options = options || {};
        options = that.fillData(options, defaultOptions);
        if (!options['url'] && url) {
            options['url'] = url;
        }
        that.ajax(url, {
            url: options.url,
            type: 'GET',
            success: function(result) {
                var resultJson = JSON.parse(result);
                if (resultJson.token) {
                    if (typeof resultJson.token === 'string') {
                        that.__token = resultJson.token;
                    }
                    _g.log('token value(after ajax): ' + window.tnk.__token);
                    if (resultJson.resultStatus.toLowerCase() === 'success') {
                        options.success(resultJson);
                    } else {
                        that.handleJSONError(resultJson);
                    }
                }
            },
            error: function(xhr) {
                if (options.error) options.error(xhr);
            },
            hideAjaxMask: options.hideAjaxMask
        });
    };

    /**
     * JSONのresultStatusがsuccess以外の時の処理。
     * window.tnk.ajaxJSONから呼ぶ。
     * @param json
     */
    _g.handleJSONError = function (json) {
        //documentはローカル変数
        switch (json.resultStatus.toLowerCase()) {
            case 'auth_error':
            case 'login':
            case 'input':
            case 'system_error':
            case 'amegold_error':
            case 'fail':
            case 'error':
                if (json.url) {
                    document.location = json.url;
                }
                break;
            case 'none':
                //TODO何もしないなら消す
                break;
            case 'user_alert':
                if (commonMsgUtil) {
                    commonMsgUtil.showCommonDialog({mainText: json.message});
                }
                break;
            case 'reload':
            case 'token_error':
                //トークンエラーは画面リロード
                window.location.reload();
                break;
            case 'redirect':
                //エラーではないが、とりあえずここで処理
                if (json.url) {
                    document.location = json.url;
                }
                break;
            default:
                if (json.url) {
                    document.location = json.url;
                }
                break;
        }
    };

    /**
     * 文字数カウンタ。
     * 制限文字数を超過した場合はdisableElで指定した要素にdisabledを負荷する
     * @param maxLength
     * @param targetEl
     * @param counterEl
     * @param disableEl
     * @return {Function}
     */
    _g.charCounter = function (maxLength, targetEl, counterEl, disableEl) {
        var that = this;
        that.target = targetEl;
        that.counter = counterEl;
        that.maxLen = maxLength;
        that.disable = disableEl;
        that.haveFocus = false;
        that.handleTimer = function () {
            var currentLength = that.target.value.length;
            var countDown = that.maxLen - currentLength;
            that.counter.innerHTML = countDown;
            if (countDown < 0) {
                that.counter.style.color = 'red';
                if (that.disable) that.disable.setAttribute('data-enabled', 'false');
            } else {
                that.counter.style.color = '';
                if (that.disable) that.disable.setAttribute('data-enabled', 'true');
            }
            if (that.haveFocus) setTimeout(that.handleTimer, 600);
        };

        return function () {
            that.handleTimer();
            if (that.disable) that.disable.setAttribute('data-enabled', 'true');
            that.target.addEventListener('focus', function () {
                that.haveFocus = true;
                that.handleTimer();
            });
            that.target.addEventListener('blur', function () {
                that.haveFocus = false;
            });
        };
    };

    //TODO 消す
    _g.disableActionTag = function (isDisabled) {
        //ダイアログボックス以外のaタグ, inputタグを取得
        var tags = document.querySelectorAll('#main a, #main input');
        for (var i = 0, len = tags.length; i < len; i++) {
            tags[i].setAttribute('disabled', isDisabled);
        }
    };
    /**
     * xss起こしそうな文字をエスケープ
     * @param str
     * @return {*}
     */
    _g.escapeHTML = function (str) {
        return str.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    /**
     * カスタムイベント発火処理
     * @param eventType
     */
    _g.fireEvent = function (eventType) {
        var event = document.createEvent('Events');
        event.initEvent(eventType, true, true);
        document.dispatchEvent(event);
    };

    _g.getFormattedElapsedTime = function (dateString) {
        var baseDate, curDate, digit, elapsedTime, result;
        digit = function (num) {
            if (num < 10) {
                num = ' ' + num;
            }
            return num;
        };
        baseDate = new Date(Date.parse(dateString));
        curDate = new Date();
        result = "";
        elapsedTime = Math.ceil((curDate - baseDate) / 1000);
        if (elapsedTime < 60) {
            result = "たった今";
        } else if (elapsedTime < 120) {
            result = "約 1分前";
        } else if (elapsedTime < 3600) {
            result = "約" + digit(Math.floor(elapsedTime / 60)) + "分前";
        } else if (elapsedTime < 7200) {
            result = "約 1時間前";
        } else if (elapsedTime <= 86400) {
            result = "約" + digit(Math.floor(elapsedTime / 3600)) + "時間前";
        } else {
            result = digit(baseDate.getMonth()) + "/" + digit(baseDate.getDate());
        }
        _g.log(result);
        return result;
    };

    /**
     * ダイアログの背景のinput, a等のタグにdisplay:noneつける
     * @param isDialogShown true: display:none外す。 false: display:noneつける
     * @param isAjax
     */
    _g.toggleBackgroundActionTag = function (isDialogShown, isAjax) {
        //TODO window.tnkはローカル変数
        try {
            var actionTags;
            if (isAjax) {
                actionTags = document.querySelectorAll('a, textarea, input, select, button');
            } else {
                actionTags = document.querySelectorAll('#mainContent a, #mainContent textarea, #mainContent input, #mainContent select, #globalHeader a, #globalFooter a, #mypageHeader a, #amb_footer a, #amb_footer button');
            }

            for (var i = 0, len = actionTags.length; i < len; i++) {
                if (isDialogShown) {
                    if (isAjax) {
                        window.tnk.addClass(actionTags[i], 'ajaxHidden');
                    } else {
                        window.tnk.addClass(actionTags[i], 'dialogHidden');
                    }
                } else {
                    if (isAjax) {
                        window.tnk.removeClass(actionTags[i], 'ajaxHidden');
                    } else {
                        window.tnk.removeClass(actionTags[i], 'dialogHidden');
                    }
                }
            }
        } catch (e) {
            _g.log('Error', e.stack);
            throw e;
        }
    };
    _g.toggleAjaxMask = function(isShown) {
        try {
            var totalHeight = 0;
            var mask = document.getElementById('maskDialog');
            var main = document.getElementById('main');
            var dialog = undefined;
            var offsetHeight = main.offsetHeight + 151;
            if (window.tnk.currentActiveDialogId) {
                dialog = document.getElementById(window.tnk.currentActiveDialogId);
            }
            //表示されている画面のトップから50pxくらいの場所
            if (mask) {
                if (isShown) {
                    window.tnk.removeClass(mask, 'ajaxLoadingMini');
                    window.tnk.addClass(mask, 'ajaxLoading');
                    mask.style.height = offsetHeight + 'px';
                    if (window.scrollY) {
                        if (dialog) totalHeight = offsetHeight + window.scrollY;
                        if (offsetHeight < totalHeight) {
                            mask.style.height = totalHeight + 'px';
                        }
                        mask.style.backgroundPosition = 'center ' + (window.scrollY + 100) + 'px';
                    } else {
                        mask.style.backgroundPosition = 'center 100px';
                    }
                    window.tnk.toggleBackgroundActionTag(true, true);
                } else {
                    window.tnk.removeClass(mask, 'ajaxLoading');
                    window.tnk.toggleBackgroundActionTag(false, true);
                }
            }
        } catch (e) {
            window.tnk.log('Error', e.stack);
            throw e;
        }

    };

    /**
     * 指定されたIDのダイアログを隠す
     * @param dialogId
     * @param hideDialogOnly
     */
    _g.hideDialogTimeoutDelay = (function() {
        if (_g.useNewOnFastClick) {
            if (_g.os.android) return 800; // Android -> 800ms
            if (_g.os.ios) return 400;     // iOS     -> 400ms
            return 100;                    // others  -> 100ms
        } else {
            return 100;                    // all -> 100ms
        }
    })();
    _g.hideDialogTimeoutId = null;
    _g.hideDialog = function (dialogId, hideDialogOnly) {
        //console.log('called _g.hideDialog("' + dialogId + '")');
        if (_g.hideDialogTimeoutId) {
            clearTimeout(_g.hideDialogTimeoutId);
            _g.hideDialogTimeoutId = null;
        }
        _g.hideDialogTimeoutId = setTimeout(function() {
            var dialog = document.getElementById(dialogId);
            dialog.style.display = 'none';
            //マスク表示
            if (!hideDialogOnly) {
                var mask = document.getElementById('maskDialog');
                var dialogContainer = document.getElementById('dialogContainer');
                if (mask) {
                    _g.removeClass(mask, 'ajaxLoadingMini');
                    mask.style.display = '';
                }
                if (dialogContainer) _g.addClass(dialogContainer, 'hidden');
                window.tnk.toggleBackgroundActionTag(false);
            }
            if (window.tnk.currentActiveDialogId === dialogId) {
                window.tnk.currentActiveDialogId = undefined;
            }
        }, _g.hideDialogTimeoutDelay);
    };


    /**
     * 指定されたクラスを持つダイアログをすべて隠す
     * @param dialogClass ダイアログのクラス
     */
    _g.hideDialogByClass = function (dialogClass) {
        var dialogs = document.getElementsByClassName(dialogClass);
        for (var i = 0, len = dialogs.length; i < len; i++) {
            dialogs[i].style.display = 'none';
        }
        //マスク表示
        var mask = document.getElementById('maskDialog');
        var dialogContainer = document.getElementById('dialogContainer');
        if (mask) {
            _g.removeClass(mask, 'ajaxLoadingMini');
            mask.style.display = '';
        }
        if (dialogContainer) _g.addClass(dialogContainer, 'hidden');
        window.tnk.currentActiveDialogId = undefined;
        window.tnk.toggleBackgroundActionTag(false);
    };
    /**
     * 指定されたIDのダイアログを表示する
     * @param dialogId ダイアログのID
     */
    _g.showDialog = function (dialogId) {
        //現在表示中のダイアログがあれば隠す
        if (window.tnk.currentActiveDialogId && window.tnk.currentActiveDialogId !== dialogId) {
            window.tnk.hideDialog(window.tnk.currentActiveDialogId, true);
        }

        window.tnk.toggleBackgroundActionTag(true);

        var mask = document.getElementById('maskDialog');
        var dialogContainer = document.getElementById('dialogContainer');
        var main = document.getElementById('main');
        var dialog = document.getElementById(dialogId);
        var offsetHeight = main.offsetHeight + 151;
        var totalHeight = 0;

        //マスク表示
        if (mask) {
            _g.removeClass(mask, 'ajaxLoadingMini');
            mask.style.display = 'block';
            mask.style.height = offsetHeight + 'px';
        }
        if (dialogContainer) _g.removeClass(dialogContainer, 'hidden');

        //ダイアログ表示
        //TODO window.pageYか？
        dialog.style.display = 'block';
        _g.log('window.scrollY: ', window.scrollY);
        _g.log('dialog.offsetHeight: ', dialog.offsetHeight);
        if (window.scrollY) {
            totalHeight = dialog.offsetHeight + window.scrollY;
            if (offsetHeight < totalHeight) {
                mask.style.height = totalHeight + 30 + 'px';
            }
            dialogContainer.style.top = window.scrollY + 'px';
        } else {
            dialogContainer.style.top = '0px';
        }
        window.tnk.currentActiveDialogId = dialogId;
    };

    /**
     * POSTで指定のurlにsubmitする。
     * formは動的に作成される。
     * @param url
     * @param data
     * @param isUpdate
     */
    _g.submitData = function (url, data, isUpdate) {
        if (isUpdate && _g.isTokenSubmitted) {
            return; // 戻り値はどこにも使われていない
        }
        //一度trueにしたら同じページ内ではfalseにならない
        if (isUpdate) {
            _g.isTokenSubmitted = true;
        }
        var tempForm = document.createElement('form');
        tempForm.setAttribute('action', url);
        tempForm.setAttribute('method', 'POST');
        _g.log('submit url: ' + url);

        //データの更新を伴う場合、tokenを送信データに追加
        if (isUpdate) {
            var tokenInput = document.createElement('input');
            tokenInput.setAttribute('type', 'text');
            tokenInput.setAttribute('name', 'token');
            tokenInput.setAttribute('value', window.tnk.__token);
            tempForm.appendChild(tokenInput);
            _g.log('token value(submit): ' + tempForm.querySelector('input[name=token]').value);
        }

        for (var name in data) {
            //TODO data.hasOwnProperty
            var tempInput = document.createElement('input');
            tempInput.setAttribute('type', 'text');
            tempInput.setAttribute('name', name);
            tempInput.setAttribute('value', data[name]);
            tempForm.appendChild(tempInput);
            _g.log('param[' + name + ']:' + tempForm.querySelector('input[name=' + name + ']').value);
        }
        setTimeout(function () {
            tempForm.submit();
        }, 100);
    };

    /**
     * タブ表示・設定クラス
     * @constructor
     */
    _g.tab = function () {
        var that = this;
        //選択中のページ
        this.selectedPage = undefined;
        this.setUp = {
            //タブのli配列
            tabs:[],
            //タブの内容配列
            pages:[]
        };

        this.init = function () {
            var tabs = that.setUp.tabs;
            var pages = that.setUp.pages;
            for (var i = 0, len = pages.length; i < len; i++) {
                //if (i !== 0) pages[i].style.display = 'none';
                if (!pages[i].classList.contains('selected')) {
                    pages[i].style.display = 'none';
                } else {
                    that.selectedPage = pages[i];
                }
                tabs[i].onFastClick(that.showTabPage, false);
            }
        };

        this.showTabPage = function (e) {
            e.preventDefault();
            var tabs = that.setUp.tabs;
            var pages = that.setUp.pages;
            var num;

            for (num = 0, len = tabs.length; num < len; num++) {
                if (tabs[num] === e.currentTarget) {
                    break;
                }
            }

            for (var i = 0, len = pages.length; i < len; i++) {
                if (i === num) {
                    pages[num].style.display = 'block';
                    pages[num].classList.add('selected');
                    tabs[num].classList.add('selected');
                    that.selectedPage = pages[num];
                } else {
                    pages[i].style.display = 'none';
                    pages[i].classList.remove('selected');
                    tabs[i].classList.remove('selected');
                }
            }
            //TODO fireEventを拡張して
            var event = document.createEvent('Events');
            event.initEvent('tabpagechanged', true, true);
            event.selectedPage = that.selectedPage;
            pages[num].parentNode.dispatchEvent(event);

        };

        this.showTabPageById = function (id) {
            var tabs = that.setUp.tabs;
            var pages = that.setUp.pages;
            var num;
            for (num = 0, len = pages.length; num < len; num++) {
                if (pages[num].id === id) break;
            }
            for (var i = 0, len = pages.length; i < len; i++) {
                if (i === num) {
                    pages[num].style.display = 'block';
                    pages[num].classList.add('selected');
                    tabs[num].classList.add('selected');
                    that.selectedPage = pages[num];
                } else {
                    pages[i].style.display = 'none';
                    pages[i].classList.remove('selected');
                    tabs[i].classList.remove('selected');
                }
            }
            var event = document.createEvent('Events');
            event.initEvent('tabpagechanged', true, true);
            event.selectedPage = that.selectedPage;
            pages[num].parentNode.dispatchEvent(event);
        };
    };

    /**
     * カード詳細の選択状態トグル
     * @param target ターゲットDOMElement
     * @param status
     * default: デフォルト値。通常トグル
     * check: チェックされていなければチェックする。チェックされている場合は何もしない
     * none: チェックされていたらチェックを外す
     * 'check'と'none'は全選択時に使用する想定。通常時はstatusを指定する必要はない。
     */
    _g.toggleCardDetail = function (target, status) {
        if (!status) {
            status = 'default';
        }
        if (!_g.hasClass(target, 'checked')) {
            if (status !== 'none') {
                _g.addClass(target.querySelector('.checkBox'), 'checked');
                _g.addClass(target, 'checked');
            }
        } else {
            if (status !== 'check') {
                _g.removeClass(target.querySelector('.checkBox'), 'checked');
                _g.removeClass(target, 'checked');
            }
        }
    };

    _g.hasClass = function (el, value) {
        if (value instanceof Array) {
            var result = false;
            [].forEach.call(value, function (tempClass) {
                if (el.classList.contains(tempClass)) result = true;
            });
            return result;
        } else {
            return el.classList.contains(value);
        }
    };
    _g.toggleClass = function (el, value) {
        el.classList.toggle(value);
    };
    _g.addClass = function (el, value) {
        el.classList.add(value);
    };
    _g.removeClass = function (el, value) {
        el.classList.remove(value);

    };
    //URLのパラメータをオブジェクトで取得
    _g.getUrlVars = function (urlString) {
        //TODO windowのローカル変数化
        var vars = {}, hash, hashes;
        if (urlString) {
            hashes = urlString.slice(urlString.indexOf('?') + 1).split('&');
        } else {
            hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        }
        for (var i = 0, len = hashes.length; i < len; i++) {
            hash = hashes[i].split('=');
            vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
        }
        return vars;
    };

    //前後のスペースをトリムする
    _g.trimStr = function(str) {
        //TODO string.trim()が使えるかも？
        return str.replace(/(^\s+)|(\s+$)/g, "");
    };

    _g.isEmptyObject = function(obj){
        for ( var name in obj ) {
            //TODO obj.hasOwnProperty
            return false;
        }
        return true;
    };

    /**
     * 型判別
     * @param type
     * @param obj
     * @return {Boolean}
     */
    _g.is = function(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    };

    /**
     * Google Analytics設定オブジェクト
     * @type {Object}
     */
    _g.ga = {
        pushEvent: function(categories, actions, labels, values, implicitCnt){
            if ('_gaq' in window) {
                _gaq.push(['_trackEvent', categories, actions, labels, values, implicitCnt]);
            }
        },
        pushPageView: function(pageUrl){
            if ('_gaq' in window) {
                _gaq.push(['_trackPageview', pageUrl]);
            }
        }
    };

    //バナークリック数カウント処理(Google Analytics)
    _g.initLinkBanner = function(){
        var banners = document.querySelectorAll('.bannerImage a');
        [].forEach.call(banners, function(banner){
            banner.onFastClick(function(e){
                _g.ga.pushEvent('banner', this.getAttribute('data-banner-id'), this.getAttribute('data-banner-type'));
            });
        });
    };

    /**
     * 継承
     * @param Child  子関数
     * @param Parent 親関数
     */
    _g.extend = function(Child, Parent) {
        var F = function(){};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.uber = Parent.prototype;
    };


    _g.encodeHtmlForm = function (data) {
        var params = [];
        for (var name in data) {
            var value = data[ name ];
            var param = encodeURIComponent(name).replace(/%20/g, '+') +
                        '=' + encodeURIComponent(value).replace(/%20/g, '+');
            params.push(param);
        }
        return params.join('&');
    };
    /**
     * hrefに'javascript:void(0);'が設定されていない&&tokenの設定されているすべてのaタグをjsでハンドリングする。
     * Andoriod では 'javascript: void(0);' と定義してはいけない
     */
    _g.initLink = function (){
        var _VOID_LINK_HREF = 'javascript:void(0);', _VOID_LINK_HREF_S = 'javascript:void(0)',
            links = document.querySelectorAll('#main a, #dialogContainer a');

        [].forEach.call(links, function(link){

            if (_g.hasClass(link.parentNode, ['decoBtn', 'actBtn', 'actBtnSq', 'decoBtnSq'])){
                link.addEventListener('touchstart', function(e){
                    _g.addClass(this.parentNode, 'touch');
                });
                link.addEventListener('touchmove', function(e){
                    _g.removeClass(this.parentNode, 'touch');
                });
                link.addEventListener('touchend', function(e){
                    _g.removeClass(this.parentNode, 'touch');
                });
            }

            var shortenHref = link.href.replace(/ /, '', 'g'); // 'javascript: void(0);' ← こう書かれているものに対応

            if ((shortenHref !== _VOID_LINK_HREF) && (shortenHref !== _VOID_LINK_HREF_S)) {
                link.onFastClick((function(link){
                    var url = link.href,
                        anchor = undefined,
                        paramObj = {},
                        urlAry;

                    //if (location.hash) {
                    if (url.indexOf('#') > -1) {
                        //anchor = location.hash;
                        urlAry = url.split('#');
                        anchor = '#' + urlAry[1];
                        url = urlAry[0];

                        //hrefに設定されてる値がアンカーだけの時
                        if (link.getAttribute('href') === anchor) {
                            url = anchor;
                            anchor = undefined;
                        }
                    }



                    if (url.indexOf('?') > -1 && location.href.length !== location.href.indexOf('?') + 1) {
                        paramObj = _g.getUrlVars(url);
                    }

                    //urlをパラメータのない値に変更
                    if (!_g.isEmptyObject(paramObj) && paramObj.hasOwnProperty('token')) {
                        url = url.split('?')[0];
                        link.href = _VOID_LINK_HREF;

                        return function(e){
                            e.preventDefault();
                            if (_g.isTokenSubmitted) {
                                return false;
                            }
                            _g.isTokenSubmitted = true;
                            //もともとのhrefの値にtokenが設定されていた時のみtokenを設定
                            if (_g.__token && paramObj.hasOwnProperty('token')) paramObj.token = _g.__token;
                            window.location = url + ( !_g.isEmptyObject(paramObj) ? '?' + _g.encodeHtmlForm(paramObj) : '') + (anchor ? anchor : '');
                            return true;
                        };
                    } else {
                        return function(){};
                    }

                })(link));
            } else {
                if (link.href !== _VOID_LINK_HREF) {
                    console.log('-- consider HREF -> "' + link.href + '"');
                }
            }
        });
    };


    // global footer の調整
    _g.arrangeGlobalFooter = function() {
        var elementsAll = document.querySelectorAll('footer#globalFooter a');
        if (!elementsAll) { return; }
        var element = elementsAll[0];
        if (!element) { return; }
        if (document.querySelector('body#mypage')) {
            element.innerHTML = 'トップ';
            element.href = '/';
        } else {
            element.innerHTML = 'マイペ';
            element.href = '/mypage';
        }
    };

    //window.tnk = _g;

})(window.tnk);

var _g = window.tnk;

////////////////////////////////////////////////////////////////////////////////
// タップイベント処理
(function() {

    ////////////////////////////////////////////////////////////////////////////////
    // id 管理
    var IdManager = {
        id: 0,
        get: function() { return this.id++; }
    };

    ////////////////////////////////////////////////////////////////////////////////
    // タッチ情報管理クラス
    var TapInfo = function(element, callback) {
        this.id = IdManager.get(); // 管理ID
        this.element = element;    // 対象要素の参照
        this.callback = callback;  // コールバック関数
        this.tapX = 0;
        this.tapY = 0;
        this.isTouchStart = false;
        //this.handler = null;       // 対応するイベントハンドラ
        //console.log(element + ':' + element.tagName + ':' + callback); //debug
    };

    // タップ開始位置のセット
    TapInfo.prototype.setPos = function(x, y) {
        this.tapX = x;
        this.tapY = y;
        this.isTouchStart = true;
    };

    // 指の位置が規定範囲内か？
    TapInfo.prototype.isWithinMargin = function(x, y, margin) {
        var dx = x - this.tapX;
        var dy = y - this.tapY;
        return ((dx * dx + dy * dy) <= margin * margin);
    };

    // タップ情報だけをリセットする
    TapInfo.prototype.reset = function() {
        this.tapX = 0;
        this.tapY = 0;
        this.isTouchStart = false;
    };


    ////////////////////////////////////////////////////////////////////////////////
    // TapChecker 管理オブジェクト
    var TapCheckerManager = {
        // 登録されているオブジェクト一覧（TapChecker のインスタンスの一覧）
        checkers: {},

        // タッチイベントが有効か？
        hasTouch: (('ontouchstart' in window) ? true : false),

        // 指定要素を TapChecker に紐付けする
        addListener: function(element, callback) {
            if (element.addEventListener) {
                if (this.hasTouch) {
                    var tapChecker = new TapChecker(element, callback);
                    this.checkers[tapChecker.getId()] = tapChecker;
                } else {
                    element.addEventListener('click', callback, true);
                }
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////
    // TapChecker クラス
    var TapChecker = function(element, callback) {
        this.tapInfo = new TapInfo(element, callback);
        this.handler = this.getHandler();
        for (var i = 0, nbItems = TapChecker.touchEventList.length; i < nbItems; i++) {
            element.addEventListener(TapChecker.touchEventList[i], this.handler, true);
        }
    };
    TapChecker.tapMargin = 10; // 最初の指の位置からどこまでを同一位置とみなすかの幅
    TapChecker.touchEventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'click' ];

    //////////////////////////////
    // ID 取得
    TapChecker.prototype.getId = function() {
        return this.tapInfo.id;
    };

    //////////////////////////////
    // イベントハンドラ
    TapChecker.prototype.getHandler = function() {
        var self = this;
        return function(event) {
            // click イベントの場合は event.touches も event.changedTouches も存在しない
            var touchPos = {};
            if ((event.touches !== undefined) && (event.touches.length !== 0)) {
                touchPos.x = event.touches[0].clientX;
                touchPos.y = event.touches[0].clientY;
            } else if ((event.changedTouches !== undefined) && (event.changedTouches.length !== 0)) {
                touchPos.x = event.changedTouches[0].clientX;
                touchPos.y = event.changedTouches[0].clientY;
            }

            if (self.tapInfo) {
                switch (event.type) {
                    case 'touchstart':
                        //console.log('>touchstart');
                        self.tapInfo.setPos(touchPos.x, touchPos.y);
                        break;
                    case 'touchmove':
                        //console.log('>touchmove');
                        if (self.tapInfo.isTouchStart === true) {
                            if (self.tapInfo.isWithinMargin(touchPos.x, touchPos.y, TapChecker.tapMargin) !== true) {
                                self.tapInfo.reset();
                            }
                        }
                        break;
                    case 'touchend':
                        //console.log('>touchend');
                        if (self.tapInfo.isTouchStart === true) {
                            if (self.tapInfo.isWithinMargin(touchPos.x, touchPos.y, TapChecker.tapMargin) === true) {
                                self.fireEventCallback();
                            }
                            self.tapInfo.reset();
                        }
                        break;
                    case 'touchcancel':
                        //console.log('>touchcancel');
                        self.tapInfo.reset();
                        break;
                    case 'click':
                        //console.log('>click');
                        // stopPropagation() すると、a タグがうまく動かないっぽい
                        //    event.preventDefault();
                        //    if (event.stopImmediatePropagation) {
                        //        event.stopImmediatePropagation();
                        //    } else {
                        //        event.stopPropagation();
                        //    }
                        self.tapInfo.reset();
                        break;
                    default:
                        break;
                }
            }
        };
    };

    //////////////////////////////
    // イベントを発火させる
    TapChecker.prototype.fireEventCallback = function() {
        var element = this.tapInfo.element;
        var callback = this.tapInfo.callback;

        // クリックイベントハンドラの付け替え ← Android でうまくいかない模様 ← 第３引数で解決
        element.removeEventListener('click', this.handler, true);
        element.addEventListener('click', callback, true);

        // 発火
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, // bubbling, cancelable
            0, 0, 0, 0, false, false, false, false, 0, null);
        element.dispatchEvent(event);

        // クリックイベントハンドラを戻す
        element.removeEventListener('click', callback, true);
        element.addEventListener('click', this.handler, true);
    };

    window.tnk.TapCheckerManager = TapCheckerManager;

})();

/*! gatekeeper.js - v0.0.1 - 2012-12-27
 * Copyright (c) 2012 HIRAKI Satoru; Licensed Apache License, Version 2.0 */
(function() {
    var Gk, _addHandler, _bind, _gk_instances, _handleEvent, _handlers, _id, _level, _matchesSelector, _removeHandler;
    _level = 0;
    _id = 0;
    _handlers = {};
    _gk_instances = {};
    _matchesSelector = function(el, selector, bound_el) {
        var getMatcher;
        getMatcher = function(el) {
            var matcher;
            matcher = void 0;
            if (matcher) {
                return matcher;
            }
            if (matcher == null) {
                matcher = el.matches;
            }
            if (matcher == null) {
                matcher = el.webkitMatchesSelector;
            }
            if (matcher === void 0) {
                throw new Error('There is no mache element');
            }
            return matcher;
        };
        if (selector === '_root') {
            return bound_el;
        }
        if (el === bound_el) {
            return;
        }
        if (getMatcher(el).call(el, selector)) {
            return el;
        }
        if (el.parentNode) {
            _level++;
            return _matchesSelector(el.parentNode, selector, bound_el);
        }
    };
    _addHandler = function(gk, evt, selector, cb) {
        var _base, _base1, _name, _ref, _ref1, _ref2;
        if ((_ref = _handlers[_name = gk.id]) == null) {
            _handlers[_name] = {};
        }
        if ((_ref1 = (_base = _handlers[gk.id])[evt]) == null) {
            _base[evt] = {};
        }
        if ((_ref2 = (_base1 = _handlers[gk.id][evt])[selector]) == null) {
            _base1[selector] = [];
        }
        return _handlers[gk.id][evt][selector].push(cb);
    };
    _removeHandler = function(gk, evt, selector, cb) {
        var handlerLen, i, targetSelector, _results;
        if (!cb && !selector) {
            _handlers[gk.id][evt] = {};
            return;
        }
        if (!cb) {
            delete _handlers[gk.id][evt][selector];
            return;
        }
        i = 0;
        targetSelector = _handlers[gk.id][evt][selector];
        handlerLen = targetSelector.length;
        _results = [];
        while (i < handlerLen) {
            if (targetSelector[i] === cb) {
                targetSelector.pop(i, 1);
                break;
            }
            _results.push(i++);
        }
        return _results;
    };
    _handleEvent = function(id, e, type) {
        var cancel, i, j, match, matchLen, matched, matches, selector, selectors, target, targetType;
        targetType = _handlers[id][type];
        if (!targetType) {
            return;
        }
        target = e.target;
        selector = void 0;
        match = void 0;
        matches = {};
        i = 0;
        j = 0;
        _level = 0;
        cancel = function(e) {
            e.preventDefault();
            return e.stopPropagation();
        };
        selectors = Object.keys(targetType);
        selectors.forEach(function(selector) {
            var matchesEvent, targetSelector;
            targetSelector = _handlers[id][type][selector];
            match = _matchesSelector(target, selector, _gk_instances[id].element);
            matchesEvent = function() {
                return true;
            };
            if (match && matchesEvent(type, _gk_instances[id].element, match, selector === '_root', e)) {
                _level++;
                targetSelector.match = match;
                return matches[_level] = targetSelector;
            }
        });
        e.stopPropagation = function() {
            return e.cancelBubble = true;
        };
        i = 0;
        while (i <= _level) {
            if (matches[i]) {
                j = 0;
                matchLen = matches[i].length;
                while (j < matchLen) {
                    matched = matches[i][j];
                    if ((matched != null) && matched.call(matches[i].match, e) === false) {
                        cancel(e);
                        return;
                    }
                    if (e.cancelBubble) {
                        return;
                    }
                    j++;
                }
            }
            i++;
        }
    };
    _bind = function(evt, selector, cb, remove) {
        var addEvent, checkType, evLen, global_cb, i, id;
        checkType = function(type, arg) {
            var object;
            object = Object.prototype.toString.call(arg).slice(8, -1);
            if ((arg != null) && object === type) {
                return true;
            } else {
                return false;
            }
        };
        addEvent = function(gk, type, cb) {
            var use_capture;
            use_capture = type === 'blur' || type === 'focus';
            return gk.element.addEventListener(type, cb, use_capture);
        };
        if (!checkType('Array', evt)) {
            evt = [evt];
        }
        if (!cb && checkType('Function', selector)) {
            cb = selector;
            selector = '_root';
        }
        id = this.id;
        global_cb = function(e) {
            return _handleEvent(id, e, global_cb.original);
        };
        i = void 0;
        i = 0;
        evLen = evt.length;
        while (i < evLen) {
            global_cb.original = evt[i];
            if (!_handlers[this.id] || !_handlers[this.id][evt[i]]) {
                addEvent(this, evt[i], global_cb);
            }
            if (remove) {
                _removeHandler(this, evt[i], selector, cb);
            }
            _addHandler(this, evt[i], selector, cb);
            i++;
        }
        return this;
    };
    Gk = (function() {

        function Gk(el, id) {
            var key;
            if (!(this instanceof Gk)) {
                for (key in _gk_instances) {
                    if (_gk_instances[key].element === el) {
                        return _gk_instances[key];
                    }
                }
                _id++;
                _gk_instances[_id] = new Gk(el, _id);
                return _gk_instances[_id];
            }
            this.element = el;
            this.id = _id;
        }

        Gk.prototype.on = function(evt, selector, cb) {
            return _bind.call(this, evt, selector, cb);
        };

        Gk.prototype.off = function(evt, selector, cb) {
            return _bind.call(this, evt, selector, cb, true);
        };

        return Gk;

    })();
    return window.Gk = Gk;
})();
////////////////////////////////////////////////////////////////////////////////
