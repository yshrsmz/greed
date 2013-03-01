// Generated by CoffeeScript 1.5.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (!('Greed' in window)) {
    window.Greed = {};
  }

  (function(Greed) {
    var AjaxCore, gr;
    gr = Greed || {};
    gr.activeAjaxCount = 0;
    gr.isAjaxActive = function() {
      return !!gr.activeAjaxCount;
    };
    AjaxCore = (function() {

      function AjaxCore(url, options) {
        this._onAjaxTimeout = __bind(this._onAjaxTimeout, this);
        this._onReadyStateChange = __bind(this._onReadyStateChange, this);        this.xhr = new XMLHttpRequest();
        this.url = url;
        this.options = options;
        this._deferred = new gr.Deferred();
        this.responseReceived = false;
        this.xhrTimeout = null;
        if (this._check()) {
          this._send();
        } else {
          this._deferred.rejectWith(this);
        }
      }

      AjaxCore.prototype.defaults = {
        url: '',
        type: 'POST',
        dataType: 'text',
        async: true,
        cache: false,
        data: null,
        contentType: 'application/x-www-form-urlencoded',
        success: null,
        error: null,
        complete: null,
        onTimeout: null,
        timeoutDuration: 60 * 1000,
        accepts: {
          text: 'text/plain',
          html: 'text/html',
          xml: 'application/xml, text/xml',
          json: 'application/json, text/javascript'
        }
      };

      /*
      return promise for this xhr
      */


      AjaxCore.prototype.getPromise = function() {
        return this._deferred.promise();
      };

      AjaxCore.prototype._emptyFunc = function() {};

      AjaxCore.prototype._send = function() {
        var opts;
        opts = this.options;
        if (!opts.cache) {
          opts.url += (opts.url.indexOf('?') > -1 ? '&' : '?') + '_nocache=' + (new Date()).getTime();
        }
        if (opts.data) {
          if (opts.type === 'GET') {
            opts.url += (opts.url.indexOf('?') > -1 ? '&' : '?') + gr.serializeData(opts.data);
            opts.data = null;
          } else {
            opts.data = gr.serializeData(opts.data);
          }
        }
        this.xhr.open(opts.type, opts.url, opts.async);
        this.xhr.setRequestHeader('Content-type', opts.contentType);
        if (opts.dataType && opts.accepts[opts.dataType]) {
          this.xhr.setRequestHeader('Accept', opts.accepts[opts.dataType]);
        }
        gr.activeAjaxCount++;
        if (gr.is('Function', opts.success)) {
          this._deferred.done(opts.success);
        }
        if (gr.is('Function', opts.error)) {
          this._deferred.fail(opts.error);
        }
        if (gr.is('Function', opts.complete)) {
          this._deferred.always(opts.complete);
        }
        if (opts.timeoutDuration && gr.is('Number', opts.timeoutDuration)) {
          this.xhrTimeout = setTimeout(this._onAjaxTimeout, opts.timeoutDuration);
        }
        if (opts.async) {
          this.xhr.onreadystatechange = this._onReadyStateChange;
          this.xhr.send(opts.data);
        } else {
          this.xhr.send(opts.data);
          this._onReadyStateChange();
        }
        return this;
      };

      AjaxCore.prototype._check = function() {
        if (gr.is('Object', this.url)) {
          this.options = this.url;
          this.url = void 0;
        }
        this.options = gr.fillData(this.options || {}, this.defaults);
        if (!this.options.url && this.url) {
          this.options.url = this.url;
        }
        return !!this.options.url;
      };

      AjaxCore.prototype._onReadyStateChange = function() {
        var data, opts;
        opts = this.options;
        data = null;
        if (this.xhr.readyState === 4 && !this.responseReceived) {
          this.responseReceived = true;
          if (this.xhrTimeout) {
            clearTimeout(this.xhrTimeout);
          }
          if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status === 304) {
            data = opts.dataType === 'xml' ? this.xhr.responseXML : this.xhr.responseText;
            if (opts.dataType === 'json') {
              data = JSON.parse(data);
            }
            this._deferred.resolveWith(this, data, this.xhr.status, this.xhr);
          } else {
            this._deferred.rejectWith(this, data, this.xhr.status, this.xhr);
          }
          gr.activeAjaxCount--;
        }
      };

      AjaxCore.prototype._onAjaxTimeout = function() {
        this.xhr.onreadystatechange = this._emptyFunc;
        this.xhr.abort();
        gr.activeAjaxCount--;
        if (gr.is('Function', this.options.onTimeout)) {
          this.options.onTimeout();
        }
      };

      return AjaxCore;

    })();
    gr.ajax = function(url, options) {
      var ajaxCore;
      ajaxCore = new gr.AjaxCore(url, options);
      return ajaxCore.getPromise();
    };
    gr.ajaxJSON = function(url, options) {
      var ajaxCore;
      options || (options = {});
      options.dataType = 'json';
      ajaxCore = new gr.AjaxCore(url, options);
      return ajaxCore.getPromise();
    };
    gr.AjaxCore = AjaxCore;
  })(Greed);

}).call(this);
