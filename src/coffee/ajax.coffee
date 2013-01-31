# Greed Ajax function
# TODO integrate Greed.Deferred
window.Greed = {} unless 'Greed' of window
do (Greed) ->
    _g = Greed or {}
    _doc = window.document
    _g.active = 0
    emptyFunc = `function() {}`
    
        
    AjaxCore = ->
        @defaults = 
            url: ''
            type: 'POST'
            data: {}
            success: undefined
            error: undefined
            
        @xhr = new XMLHttpRequest()
        
    AjaxCore.prototype.xhr = undefined
    
    AjaxCore.prototype.onAjaxTimeout = ->
        that = @
        ->
            console.log 'ajax timeout'
            that.xhr.onreadystatechange = emptyFunc
            that.xhr.abort()
            return
        
    AjaxCore.prototype.onReadyStateChange = () ->
        that = @
        
        ->
            if that.xhr.readyState is 4
                console.log 'xhr is ready'
                that.onReadyStateChange = emptyFunc
                
                if that.xhr.status is 200
                    result = that.xhr.responseText
                    
            return
    
    _g.AjaxCore = AjaxCore
    
    _g.ajax = (url, options) ->
        return new _g.AjaxCore url, options
            
    ajaxJSON = (url, options) ->
        console.log 'ajax json method'
    
    
    return