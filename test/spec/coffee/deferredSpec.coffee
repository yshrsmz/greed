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
        
        dfr.fail (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual context
            
            return
            
        dfr.resolveWith context, 123, "foo"
        
        return
        
    it "should reject with context and arguments", ->
        
        context = new Array()
        
        dfr.fail (firstArg, secondArg) ->
            expect(firstArg).toEqual 123
            expect(secondArg).toEqual "foo"
            expect(@).toEqual context
            
            return
            
        dfr.rejectWith context, 123, "foo"
        
        return
        
    it "should fire done with context and arguments after resolving", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        context = new Array()
        
        dfr.resolveWith context, 12345
        dfr.done (firstArg) ->
            doneSpy()
            expect(firstArg).toEqual 12345
            
        expect(doneSpy).toHaveBeenCalled()
        
        return
    
    it "should fire fail with context and arguments after rejecting", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        context = new Array()
        
        dfr.rejectWith context, 12345
        dfr.fail (firstArg) ->
            failSpy()
            expect(firstArg).toEqual 12345
            
        expect(failSpy).toHaveBeenCalled()
        
        return
        
    it "should execute function passed to constructor",  ->
        constructorSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        passedParam = undefined
        
        dfr = new Greed.Deferred (param) ->
            constructorSpy()
            passedParam = param
            expect(param).toEqual @
            
            @done doneSpy
            
        expect(constructorSpy).toHaveBeenCalled()
        expect(passedParam).toEqual dfr
        
        dfr.resolve()
        
        expect(doneSpy).toHaveBeenCalled()
        
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
    
describe "Promise", ->
    dfr = undefined
    
    beforeEach ->
        dfr = new Greed.Deferred()
        
    it "should be given from deferred", ->
        promise = dfr.promise()
        
        expect(promise.constructor.name).toEqual "Promise"
        
        return
        
    it "should execute done and always when deferred is resolved", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        promise = dfr.promise()
        
        promise
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
            
        dfr.resolve()
        
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
    
    it "should execute fail and always when deferred is rejected", ->
        alwaysSpy = jasmine.createSpy()
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        promise = dfr.promise()
        
        promise
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
            
        dfr.reject()
        
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
        
    it "should resolve with context", ->
        doneSpy = jasmine.createSpy()
        context = new Array()
        
        promise = dfr.promise()
        dfr.resolveWith context, 1234, "foo"
        promise.done (firstArg, secondArg) ->
            expect(this).toEqual context
            expect(firstArg).toEqual 1234
            expect(secondArg).toEqual "foo"
            doneSpy()
            
        expect(doneSpy).toHaveBeenCalled()
        
        return
        
    it "should reject with context", ->
        failSpy = jasmine.createSpy()
        context = new Array()
        
        promise = dfr.promise()
        dfr.rejectWith context, 1234, "foo"
        promise.fail (firstArg, secondArg) ->
            expect(this).toEqual context
            expect(firstArg).toEqual 1234
            expect(secondArg).toEqual "foo"
            failSpy()
            
        expect(failSpy).toHaveBeenCalled()
        
        return
            
            
describe "Deferred.when", ->
    
    it "should return a resolved promise object when called without arguments", ->
        promise = Greed.Deferred.when()
        
        expect(promise.constructor.name).toEqual "Promise"
        expect(promise.state()).toEqual "resolved"
        
        return
        
    it "should return single deferred's promise", ->
        dfr = new Greed.Deferred()
        promise = Greed.Deferred.when dfr
        
        expect(promise).toEqual dfr.promise()
        
        return
        
    it "should resolve when all deferreds are resolved", ->
        doneSpy = jasmine.createSpy()
        deferreds = [new Greed.Deferred(), new Greed.Deferred(), new Greed.Deferred()]
        promise = Greed.Deferred.when(deferreds[0], deferreds[1], deferreds[2])
        promise.done (args...) ->
            expect(args).toEqual [[1, 2], [3, 4], [5, 6]]
            doneSpy()
            return
            
        expect(promise.state()).toEqual "pending"
        
        deferreds[1].resolve(3, 4)
        expect(promise.state()).toEqual "pending"
        
        deferreds[0].resolve(1, 2)
        expect(promise.state()).toEqual "pending"
        
        deferreds[2].resolve(5, 6)
        expect(promise.state()).toEqual "resolved"
        
        expect(doneSpy).toHaveBeenCalled()
        
        return
        
    it "should reject when first deferred rejects", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        deferreds = [new Greed.Deferred(), new Greed.Deferred(), new Greed.Deferred()]
        promise = Greed.Deferred.when(deferreds[0], deferreds[1], deferreds[2])
        promise.fail (args...) ->
            expect(args).toEqual [1, 2]
            failSpy()
            return
            
        promise.done doneSpy
            
        expect(promise.state()).toEqual "pending"
        
        deferreds[1].resolve(3, 4)
        expect(promise.state()).toEqual "pending"
        
        deferreds[0].reject(1, 2)
        expect(promise.state()).toEqual "rejected"
        
        expect(failSpy).toHaveBeenCalled()
        expect(doneSpy).not.toHaveBeenCalled()
        
        return
        
describe "Deferred.pipe", ->
    dfr = undefined
    beforeEach ->
        dfr = new Greed.Deferred()
        
    it "should fire normally without parameters when resolved", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        context = new Array()
        param = "foo"
        dfr
            .pipe().done((value) ->
                expect(value).toEqual param
                expect(this).toEqual context
                doneSpy()
                return
                )
                .fail((value) ->
                    failSpy()
                    return
                    )
        
        dfr.resolveWith context, param
        
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        
        return
        
    it "should fire normally without parameters when rejected", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        context = new Array()
        param = "foo"
        dfr
            .pipe().done((value) ->
                doneSpy()
                return
                )
                .fail((value) ->
                    expect(value).toEqual param
                    expect(this).toEqual context
                    failSpy()
                    return
                    )
        
        dfr.rejectWith context, param
        
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        
        return
        
    it "should filter with function (resolve)", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        param1 = "foo"
        param2 = "bar"
        
        context = new Array()
        
        dfr
            .pipe((string1, string2) ->
                expect(string1).toEqual param1
                expect(string2).toEqual param2
                
                string1 + string2
            ).done((value) ->
                expect(value).toEqual param1 + param2
                expect(@).toEqual context
                doneSpy()
            ).fail((value) ->
                failSpy()
            )
            
        dfr.resolveWith context, param1, param2
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        
        return
        
    it "should filter with function (reject)", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        param1 = "foo"
        param2 = "bar"
        
        context = new Array()
        
        dfr
            .pipe(null, (string1, string2) ->
                expect(string1).toEqual param1
                expect(string2).toEqual param2
                
                string1 + string2
            ).done((value) ->
                
                doneSpy()
            ).fail((value) ->
                expect(value).toEqual param1 + param2
                expect(@).toEqual context
                failSpy()
            )
            
        dfr.rejectWith context, param1, param2
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        
        return
        
    it "should filter with another observable (deferred:resolve, pipe:reject)", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        param1 = "foo"
        param2 = "bar"
        
        context = new Array()
        
        pipeDfr = new Greed.Deferred()
        
        dfr.pipe((string1, string2) ->
                expect(string1).toEqual param1
                expect(string2).toEqual param2
                
                pipeDfr.rejectWith(@, string1, string2).promise()
            
            ).fail((passed1, passed2) ->
                expect(passed1).toEqual param1
                expect(passed2).toEqual param2
                expect(@).toEqual context
                failSpy()
            ).done(doneSpy)
            
        dfr.resolveWith context, param1, param2
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        
        return
        
    it "should filter with another observable (deferred:reject, pipe:resolve)", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        
        param1 = "foo"
        param2 = "bar"
        
        context = new Array()
        
        pipeDfr = new Greed.Deferred()
        
        dfr.pipe(null,
            (string1, string2) ->
                expect(string1).toEqual param1
                expect(string2).toEqual param2
                
                pipeDfr.resolveWith(@, string1, string2)
            
            ).fail(failSpy)
            .done((passed1, passed2) ->
                expect(passed1).toEqual param1
                expect(passed2).toEqual param2
                expect(@).toEqual context
                doneSpy()
            )
            
        dfr.rejectWith context, param1, param2
        expect(doneSpy).toHaveBeenCalled()
        expect(failSpy).not.toHaveBeenCalled()
        
        return
        
describe "Progress and notify", ->
    dfr = undefined
    
    beforeEach ->
        dfr = new Greed.Deferred()
        
    it "should notify with correct context", ->
        progressSpy = jasmine.createSpy()
        param1 = "foo"
        param2 = "bar"
        progressCalled = 0
        context = new Array()
        
        dfr.progress (value1, value2) ->
            progressSpy()
            progressCalled++
            expect(value1).toEqual param1
            expect(value2).toEqual param2
            expect(@).toEqual context
            return
            
        dfr.notifyWith context, param1, param2
        expect(progressSpy).toHaveBeenCalled()
        
        dfr.notifyWith context, param1, param2
        
        
        #expect(progressCalled).toEqual 2
        
        dfr.resolve()
        dfr.notify()
        
        #expect(progressCalled).toEqual 2
        
        return
        
    return