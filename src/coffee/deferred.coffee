# https://github.com/sudhirj/simply-deferred/blob/master/deferred.js
# https://github.com/wookiehangover/underscore.deferred/blob/master/underscore.deferred.js
# https://github.com/MarkBennett/future-js/blob/master/future.js
# TODO integrate with Greed.ajax

window.Greed = {} unless 'Greed' of window

do (Greed) ->
    _g = Greed or {}
    
    PENDING = 'pending'
    RESOLVED = 'resolved'
    REJECTED = 'rejected'
    
    unless Array::forEach
        throw new Error "Deferred requires Array.forEach"
        
    root = this
    
    hasOwn = (obj, prop) -> obj?.hasOwnProperty prop
    isArguments = (obj) -> hasOwn obj, 'length' and hasOwn obj, 'callee'
    
    isObservable = (obj) ->
        (obj instanceof Deferred) or (obj instanceof Promise)
        
    flatten = (array) ->
        return flatten Array.prototype.slice.call array if isArguments array
        return [array] if not Array.isArray array
        return array.reduce (memo, value) ->
            return memo.concat flatten value if Array.isArray value
            memo.push value
            return memo
        , []
        
    class Promise
        _deferred = null
        
        constructor: (deferred) ->
            @_deferred = deferred
            
        always: (args...) ->
            @_deferred.always(args...)
            this
        
        done: (args...) ->
            @_deferred.done(args...)
            this
            
        fail: (args...) ->
            @_deferred.fail(args...)
            this
            
        pipe: (doneFilter, failFilter) ->
            @_deferred.pipe doneFilter, failFilter
            
        state: ->
            @_deferred.state()
            
        then: (done, fail) ->
            @_deferred.then done, fail
            this
        
    class Deferred
                
        constructor: (fn) ->
            @_state = PENDING
            @always = @_storeCallbacks (=> @_state isnt PENDING), @_alwaysCallbacks or= []
            @done = @_storeCallbacks (=> @_state is RESOLVED), @_doneCallbacks or= []
            @fail = @_storeCallbacks (=> @_state is REJECTED), @_failCallbacks or= []
            
            fn.call(this, this) if typeof fn is 'function'
            
        _storeCallbacks: (shouldExecuteNow, holder) =>
            return (args...) =>
                return this if args.length is 0
                functions = flatten args
                if @_state is PENDING then holder.push functions...
                
                if shouldExecuteNow()
                    functions.forEach (fn) =>
                        fn.apply @_context, @_withArguments
                this
        
        always: undefined   #define in the constructor
        done: undefined     #define in the constructor
        fail: undefined     #define in the constructor
            
        #always: (args...) =>
            #return this if args.length is 0
            #functions = flatten args
            #if @_state is PENDING
                #@_alwaysCallbacks or= []
                #@_alwaysCallbacks.push(functions...)
            #else
                #functions.forEach (fn) =>
                    #fn.apply @_context, @_withArguments
            #this
            #
        #done: (args...) =>
            #return this if args.length is 0
            #functions = flatten args
            #if @_state is RESOLVED
                #functions.forEach (fn) =>
                    #fn.apply @_context, @_withArguments
            #else if @_state is PENDING
                #@_doneCallbacks or= []
                #@_doneCallbacks.push(functions...)
            #this
            #
        #fail: (args...) =>
            #return this if args.length is 0
            #functions = flatten args
            #if @_state is REJECTED
                #functions.forEach (fn) =>
                    #fn.apply @_context, @_withArguments
            #else if @_state is PENDING
                #@_failCallbacks or= []
                #@_failCallbacks.push(functions...)
            #this
            
        notify: (args...) =>
            @notifyWith(root, args...)
            this
            
        notifyWith: (context, args...) =>
            return this if @_state isnt PENDING
            @_progressCallbacks?.forEach (fn) ->
                fn.apply context, args
            this
            
        pipe: (doneFilter, failFilter) ->
            def = new Deferred()
            @done (args...) ->
                if doneFilter?
                    result = doneFilter.apply this, args
                    if isObservable result
                        result
                            .done (doneArgs...) ->
                                def.resolveWith.call(def, this, doneArgs...)
                            .fail (failArgs...) ->
                                def.rejectWith.call(def, this, failArgs...)
                    else
                        def.resolveWith.call def, this, result
                else
                    def.resolveWith.call(def, this, args...)
                    
            @fail (args...) ->
                if failFilter?
                    result = failFilter.apply this, args
                    if isObservable result
                        result
                            .done (doneArgs...) ->
                                def.resolveWith.call(def, this, doneArgs...)
                            .fail (failArgs...) ->
                                def.rejectWith(def, this, failArgs...)
                    else
                        def.rejectWith.call def, this, result
                    def.rejectWith.call(def, this, args...)
                else
                    def.rejectWith.call(def, this, args...)
                    
            def.promise()
        
        progress: (args...) =>
            return this if args.length is 0 or @_state isnt PENDING
            functions = flatten args
            @_progressCallbacks or= []
            @_progressCallbacks.push(functions...)
            this
        
        promise: =>
            @_promise or= new Promise this
            
        reject: (args...) =>
            @rejectWith(root, args...)
            this
                
        rejectWith: (context, args...) =>
            return this if @_state isnt PENDING
            @_state = REJECTED
            @_withArguments = args
            @_context = context
            @_failCallbacks?.forEach (fn) =>
                fn.apply @_context, args
                
            @_alwaysCallbacks?.forEach (fn) =>
                fn.apply @_context, args
                
            this
            
        resolve: (args...) =>
            @resolveWith(root, args...)
            this
            
        resolveWith: (context, args...) =>
            return this if @_state isnt PENDING
            @_state = RESOLVED
            @_context = context
            @_withArguments = args
            @_doneCallbacks?.forEach  (fn) =>
                fn.apply @_context, args
                
            @_alwaysCallbacks?.forEach (fn) =>
                fn.apply @_context, args
                
            this
            
        state: ->
            @_state
            
        then: (doneCallbacks, failCallbacks, progressCallbacks) =>
            @done doneCallbacks if doneCallbacks
            @fail failCallbacks if failCallbacks
            @progress progressCallbacks if progressCallbacks
            this
    
    Deferred.when = (args...) ->
        return new Deferred().resolve().promise() if args.length is 0
        return args[0].promise() if args.length is 1
        allReady = new Deferred()
        readyCount = 0
        allDoneArgs = []
        
        args.forEach (dfr, idx) ->
            dfr
                .done (doneArgs...) ->
                    readyCount += 1
                    allDoneArgs[idx] = doneArgs
                    if readyCount is args.length
                        allReady.resolve(allDoneArgs...)
                .fail (failArgs...) ->
                    allReady.rejectWith(this, failArgs...)
        
        allReady.promise()
        
    _g.Deferred = Deferred
    
    return
