root = @

describe "Deferred", ->
        
    dfr = undefined
    
    beforeEach ->
        dfr = new Greed.Deferred()
        
    it "should exist in Greed", ->
        
        expect("Deferred" of window.Greed).toBe true
        
        return
        
    it "should initialize to state 'pending'", ->
        
        expect(dfr.state()).toEqual "pending"
        return
        
    it "should change its state to 'resolved' when resolved", ->
        dfr.resolve()
        expect(dfr.state()).toEqual "resolved"
        return
        
    it "should change its state to 'rejected' when rejected", ->
        dfr.reject()
        expect(dfr.state()).toEqual "rejected"
        return
        
    it "should not change state after resolved or rejected", ->
        dfr.resolve()
        dfr.reject()
        expect(dfr.state()).toEqual "resolved"
        
        dfr = new Greed.Deferred()
        dfr.reject()
        dfr.resolve()
        expect(dfr.state()).toEqual "rejected"
        
        return
        
    it "should execute done & always callbacks after resolving, and not execute fail callbacks", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
        
        dfr.resolve()
        
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
        
    it "should execute fail & always callbacks after rejecting, and not execute done callbacks", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
        
        dfr.reject()
        
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
    
    it "should execute done callbacks added with then when resolving", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr.then doneSpy, failSpy
            
        dfr.resolve()
        
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        
        return
        
    it "should execute fail callbacks added with then when rejecting", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr.then doneSpy, failSpy
            
        dfr.reject()
        
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        
        return
        
    it "should execute done callbacks when added after resolved, and not execute fail callbacks", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr.resolve()
        dfr
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
            
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
        
    it "should execute fail callbacks when added after rejected, and not execute done callbacks", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        dfr.reject()
        dfr
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
            
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
        
    it "should resolve/reject with context", ->
        context = new Array()
        
        dfr.done ->
            expect(@).toEqual context
            
        dfr.resolveWith context
        
        dfr = new Greed.Deferred()
        dfr.fail ->
            expect(@).toEqual context
            
        dfr.rejectWith context
        
        return
        
    it "should resolve with arguments", ->
        
        dfr.done (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual root
            
            return
        
        dfr.resolve 123, "foo"
        
        return
        
    it "should reject with arguments", ->
        
        dfr.fail (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual root
            
            return
        
        dfr.reject 123, "foo"
        
        return
        
    it "should resolve with context and arguments", ->
        
        context = new Array()
        
        dfr = new Greed.Deferred()
        dfr.fail (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual context
            
            return
            
        dfr.resolveWith context, 123, "foo"
        
        return
        
    it "should reject with context and arguments", ->
        
        context = new Array()
        
        dfr = new Greed.Deferred()
        dfr.fail (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual context
            
            return
            
        dfr.rejectWith context, 123, "foo"
        
        return
    
    describe "Deferred.then() behavior", ->
        defer = undefined
        promise = undefined
        
        beforeEach ->
            defer = new Greed.Deferred()
            promise = defer.promise()
        
        it "should let you create a promise", ->
            expect(promise).toBeDefined()
            return
            
        it "should call any the promise's handler with the arguments to resolveWith()", ->
            resolved_args = [1, 2, 3]
            handler_args = undefined
            spyF = jasmine.createSpy()
            
            promise.then ->
                spyF()
                handler_args = Array.prototype.slice.call arguments[0], 0
                return
                
            defer.resolveWith defer, resolved_args
            
            expect(spyF).toHaveBeenCalled()
            expect(handler_args).toEqual resolved_args
        return
    return
    