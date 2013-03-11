# Greed Ajax function
window.Greed = {} unless 'Greed' of window
do (Greed) ->
    gr = Greed or {}
    
    gr.activeAjaxCount = 0
    gr.isAjaxActive = ->
        not not gr.activeAjaxCount
        
    
    class AjaxCore
                
        constructor: (url, options) ->
            @xhr = new XMLHttpRequest()
            @url = url
            @options = options
            @_deferred = new gr.Deferred()
            @responseReceived = false
            @xhrTimeout = null
            
            if @_check()
                @_send()
            else
                # reject so that callbacks can be executed immediately
                @_deferred.rejectWith @
                
            
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
        
        ###
        return promise for this xhr
        ###
        getPromise: ->
            return @_deferred.promise()
        
        _emptyFunc: ->
            
        _send: ->
            opts = @options
            if not opts.cache
                opts.url += (if opts.url.indexOf('?') > -1 then '&' else '?') + '_nocache=' + (new Date()).getTime()
                
            if opts.data
                if opts.type is 'GET'
                    opts.url += (if opts.url.indexOf('?') > -1 then '&' else '?') + gr.serializeData opts.data
                    opts.data = null
                else
                    opts.data = gr.serializeData opts.data
                    
            # set request
            @xhr.open opts.type, opts.url, opts.async
            @xhr.setRequestHeader 'Content-type', opts.contentType
            
            if opts.dataType and opts.accepts[opts.dataType]
                @xhr.setRequestHeader 'Accept', opts.accepts[opts.dataType]
                
            gr.activeAjaxCount++
            
            #add callbacks to deferred
            if gr.is 'Function', opts.success
                @_deferred.done opts.success
                
            if gr.is 'Function', opts.error
                @_deferred.fail opts.error
                
            if gr.is 'Function', opts.complete
                @_deferred.always opts.complete
                
            if opts.timeoutDuration and gr.is 'Number', opts.timeoutDuration
                @xhrTimeout = setTimeout @_onAjaxTimeout, opts.timeoutDuration
            
            if opts.async
                @xhr.onreadystatechange = @_onReadyStateChange
                @xhr.send opts.data
            else
                @xhr.send opts.data
                @_onReadyStateChange()
                
            return this
            
        _check: ->
            
            if gr.is 'Object', @url
                @options = @url
                @url = undefined
                
            @options = gr.extend @options or {}, @defaults
            
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
                        
                    #if gr.is 'Function', opts.success
                        #opts.success.call opts, data, @xhr.status, @xhr
                        
                    @_deferred.resolveWith @, data, @xhr.status, @xhr
                    
                else
                    #if gr.is 'Function', opts.error
                        #opts.error.call opts, @xhr, @xhr.status
                        
                    @_deferred.rejectWith @, data, @xhr.status, @xhr
                
                #if gr.is 'Function', opts.complete
                    #opts.complete.call opts, data, @xhr, @xhr.status
                    
                gr.activeAjaxCount--
            return
            
        _onAjaxTimeout: =>
            @xhr.onreadystatechange = @_emptyFunc
            @xhr.abort()
            
            gr.activeAjaxCount--
            if gr.is('Function', @options.onTimeout) then @options.onTimeout()
            return
    
    gr.ajax = (url, options) ->
        # return promise object for callback
        ajaxCore = new gr.AjaxCore(url, options)
        return ajaxCore.getPromise()
        
    gr.ajaxJSON = (url, options) ->
        options or= {}
        options.dataType = 'json'
        # return promise object for callback
        ajaxCore = new gr.AjaxCore(url, options)
        ajaxCore.getPromise()
        
    gr.AjaxCore = AjaxCore
    
    return