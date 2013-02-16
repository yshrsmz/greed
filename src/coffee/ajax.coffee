# Greed Ajax function
# TODO integrate Greed.Deferred
window.Greed = {} unless 'Greed' of window
do (Greed) ->
    _g = Greed or {}
    _doc = window.document
    
    _g.activeAjaxCount = 0
    _g.isAjaxActive = ->
        not not _g.activeAjaxCount
        
    emptyFunc = ->
        
    
    class AjaxCore
                
        constructor: (url, options) ->
            @xhr = new XMLHttpRequest()
            @url = url
            @options = options
            @_deferred = new _g.Deferred()
            @responseReceived = false
            @xhrTimeout = null
            
            if @_check()
                @_send()
            else
                # reject so that callbacks can be executed immediately
                @_deferred.rejectWith @
                
            # return promise for callback
            return @_deferred.promise()
            
        defaults:
            url: ''
            type: 'POST'
            dataType: 'text'  # text, html, json or xml
            async: true
            cache: false    # default is false, in order to prevent iOS6 from cache POST Ajax response
            data: null
            contentType: 'application/x-www-form-urlencoded'
            success: null
            error: null
            complete: null
            onTimeout: null
            timeoutDuration: 60 * 1000
            accepts: 
                text: 'text/plain'
                html: 'text/html'
                xml: 'application/xml, text/xml'
                json: 'application/json, text/javascript'
        
        _emptyFunc: ->
            
        _send: ->
            opts = @options
            if not opts.cache
                opts.url += (if opts.url.indexOf('?') > -1 then '&' else '?') + '_nocache=' + (new Date()).getTime()
                
            if opts.data
                if opts.type is 'GET'
                    opts.url += (if opts.url.indexOf('?') > -1 then '&' else '?') + _g.serializeData opts.data
                    opts.data = null
                else
                    opts.data = _g.serializeData opts.data
                    
            # set request
            @xhr.open opts.type, opts.url, opts.async
            @xhr.setRequestHeader 'Content-type', opts.contentType
            
            if opts.dataType and opts.accepts[opts.dataType]
                @xhr.setRequestHeader 'Accept', opts.accepts[opts.dataType]
                
            _g.activeAjaxCount++
            
            #add callbacks to deferred
            if _g.is 'Function', opts.success
                @_deferred.done opts.success
                
            if _g.is 'Function', opts.error
                @_deferred.fail opts.error
                
            if _g.is 'Function', opts.complete
                @_deferred.always opts.complete
                
            if opts.timeoutDuration and _g.is 'Number', opts.timeoutDuration
                @xhrTimeout = setTimeout @onAjaxTimeout(), opts.timeoutDuration
            
            if opts.async
                @xhr.onreadystatechange = @_onReadyStateChange
                @xhr.send opts.data
            else
                @xhr.send opts.data
                @_onReadyStateChange()
                
            return this
            
        _check: ->
            
            if _g.is 'Object', @url
                @options = @url
                @url = undefined
                
            @options = _g.fillData @options or {}, @defaults
            
            if not @options.url and @url
                @options.url = @url
                
            !!@options.url
            
        
                
        _onReadyStateChange: =>
            opts = @options
            data = null
            
            if @xhr.readyState is 4 and not @responseReceived
                @responseReceived = true
                if @xhrTimeout then clearTimeout @xhrTimeout
                
                if @xhr.status >= 200 && @xhr.status < 300 || @xhr.status is 304
                    data = if opts.dataType is 'xml' then @xhr.responseXML else @xhr.responseText
                    
                    if opts.dataType is 'json'
                        data = JSON.parse data
                        
                    #if _g.is 'Function', opts.success
                        #opts.success.call opts, data, @xhr.status, @xhr
                        
                    @_deferred.resolveWith @, data, @xhr.status, @xhr
                    
                else
                    #if _g.is 'Function', opts.error
                        #opts.error.call opts, @xhr, @xhr.status
                        
                    @_deferred.rejectWith @, data, @xhr, @xhr.status
                
                #if _g.is 'Function', opts.complete
                    #opts.complete.call opts, data, @xhr, @xhr.status
                    
                _g.activeAjaxCount--
            return
            
        _onAjaxTimeout: =>
            @xhr.onreadystatechange = @_emptyFunc
            @xhr.abort()
            
            _g.activeAjaxCount--
            if _g.is('Function', @options.onTimeout) then @options.onTimeout()
            return
    
    _g.ajax = (url, options) ->
        # return promise object for callback
        new _g.AjaxCore(url, options)
        
    _g.ajaxJson = (url, options) ->
        options or= {}
        options.dataType = 'json'
        # return promise object for callback
        new _g.AjaxCore(url, options)
        
    _g.AjaxCore = AjaxCore
    
    return