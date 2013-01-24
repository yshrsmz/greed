#https://github.com/sudhirj/simply-deferred/blob/master/deferred.js
#https://github.com/wookiehangover/underscore.deferred/blob/master/underscore.deferred.js

do (Greed) ->
    _g = Greed or {}
    
    AP = Array.prototype
    OP = Object.prototype
    
    hasOwn = OP.hasOwnProperty
    toString = OP.toString
    forEach = AP.forEach
    indexOf = AP.indexOf
    slice = AP.slice
    isArray = AP.isArray
    reduce = AP.reduce
    
    PENDING = 'pending'
    RESOLVED = 'resolved'
    REJECTED = 'rejected'
    
    hasOwn = (obj, prop) -> obj?.hasOwnProperty prop
    
    isArguments = (obj) ->  return hasOwn(obj, "length") and hasOwn(obj, "callee")

    flatten = (array) ->
        return flatten slice.call(array) if isArguments array
        return [array] if not isArray array
        return reduce (memo, value) ->
            return memo.concat flatten value if isArray value
            memo.push value
            return memo
        , []
        
    after = (times, func) ->
        return func() if times <= 0
        return -> func.apply(@, arguments) if --times < 1
        
    wrap = (func, wrapper) ->
        return ->
            args = [func].concat slice.call arguments, 0
            wrapper.apply this, args
            
    execute = (callbacks, args) -> callback args... for callback in flatten callbacks
        
    class Deferred
    
        _state = PENDING
        
        # callbacks that will be executed on success
        _doneCallbacks = []
        
        # callbacks that will be executed on fail
        _failCallbacks = []
        
        # callbacks that will be executeted always
        _alwaysCallbacks = []
        
        _closingArguments = {}
        
        _close = (finalState, callbacks) ->
            return ->
                if _state is PENDING
                    _state = finalState
                    _closingArguments = arguments
                    execute [callbacks, _alwaysCallbacks], _closingArguments
                return this
                
        
        constructor: ->
            @promise this
            this.when = _when
            return this
        
        resolve: _close RESOLVED, _doneCallbacks
        
        reject: _close REJECTED, _failCallbacks
        
        Promise: (candidate) ->
            candidate = candidate or {}
            candidate.state = _state
            
            storeCallbacks = (shouldExecuteNow, holder) ->
                if _state is PENDING
                    holder.push flatten arguments...
                if shouldExecuteNow 
                    execute arguments, _closingArguments
                return
                
            _pipe = (doneFilter, failFilter) ->
                deferred = new Deferred()
                _filter = (target, source, filter) ->
                    if filter
                        target ->
                            source filter (flatten arguments)...
                    else
                        target ->
                            source (flatten arguments)...
                
                _filter candidate.done, deferred.resolve, doneFilter
                _filter candidate.dail, deferred.reject, failFilter
                deferred
        
            candidate.done = storeCallbacks (_state is RESOLVED), _doneCallbacks
            candidate.fail = storeCallbacks (_state is REJECTED), _failCallbacks
            candidate.always = storeCallbacks (_state isnt PENDING), _alwaysCallbacks
            candidate.pipe = _pipe
            candidate.then = _pipe
            
            return candidate
        
        
    _when = ->
        trigger = new Deferred()
        defs = flatten arguments
        finish = after defs.length, trigger.resolve
        def.done(finish) for def in defs
        def.fail(trigger.reject()) for def in defs
        trigger.promise()
        
    _g.Deferred = -> new Deferred()
    _g.Deferred.when = _when
    _g.when = _when
    return
###
do (Greed) ->
    _g = Greed
    class Promise
        constructor: ->
            console.log 'Promise constructor'
            return {
                when: (func) ->
                    @vouch @STATUS_FULFILLED, func
                    return @
                fail: (func) ->
                    @vouch @STATUS_SMASHED, func
                    return @
                fulfill: (value) ->
                    @resolve @STATUS_FULFILEED, value
                    return @
                smash: (string) ->
                    @resolve @STATUS_SMASHED, string
                    return @
                status: ->
                    @status
                promise: ->
                    return {
                        when: @when
                        fail: @fail
                    }
            }
            
        STATUS_UNRESOLVED: 'unresolved'
        STATUS_FULFILLED: 'fulfilled'
        STATUS_SMASHED: 'smashed'
        status: @STATUS_UNRESOLVED
        waiting: []
        dreading: []
        always: []
        outcome: undefined
        vouch: (deed, func) ->
            switch status
                when 'unresolved'
                    (if deed is 'fulfilled' then @waiting else @dreading).push func
                when deed
                    func @outcome
            null
        resolve: (deed, value) ->
            if @status isnt 'unresolved'
                throw new Error "The promise has already been resolved: #{@status}"
            
            @status = deed
            @outcome = value
            for func in (if deed is @STATUS_FULFILLED then @waiting else @dreading)
                try
                    func @outcome
                catch error
                    console.log "error: #{error}"
            
            @waiting = null
            @dreading = null
        
            return
        
    _g.Promise = Promise
###