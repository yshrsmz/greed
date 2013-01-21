do (Greed) ->
    _g = Greed;
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
                    func(@outcome)
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