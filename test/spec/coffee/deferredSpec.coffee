describe "Deferred", ->
    prepareDeferred = ->
        deferred = new Greed.Deferred()
        return deferred
        
    it "Deferred should exist in Greed", ->
        
        expect("Deferred" of window.Greed).toBe true
        
        return
        
    describe "Deferred methods", ->
        deferred = undefined
        
        beforeEach ->
            deferred = new _g.Deferred()
            return
            
        it "always() is function", ->
            expect("always" of deferred).toBe true
            expect(_g.is("Function", deferred.always)).toBe true
            
        it "done() is function", ->
            expect("done" of deferred).toBe true
            expect(_g.is("Function", deferred.done)).toBe true
            
        it "fail() is function", ->
            expect("fail" of deferred).toBe true
            expect(_g.is("Function", deferred.fail)).toBe true
            
        it "pipe() is function", ->
            expect("pipe" of deferred).toBe true
            expect(_g.is("Function", deferred.pipe)).toBe true
        
        it "then() is function", ->
            expect("then" of deferred).toBe true
            expect(_g.is("Function", deferred.then)).toBe true
        
        it "when() is function", ->
            expect("when" of deferred).toBe true
            expect(_g.is("Function", deferred.when)).toBe true
            
        it "promise() is function", ->
            expect("promise" of deferred).toBe true
            expect(_g.is("Function", deferred.promise)).toBe true
            
        it "reject() is function", ->
            expect("reject" of deferred).toBe true
            expect(_g.is("Function", deferred.reject)).toBe true
            
        it "resolve() is function", ->
            expect("resolve" of deferred).toBe true
            expect(_g.is("Function", deferred.resolve)).toBe true
            
        it "rejectWith() is function", ->
            expect("rejectWith" of deferred).toBe true
            expect(_g.is("Function", deferred.rejectWith)).toBe true
            
        it "resolveWith() is function", ->
            expect("resolveWith" of deferred).toBe true
            expect(_g.is("Function", deferred.resolveWith)).toBe true
        return
    
    describe "Deferred always behavior", ->
        deferred = undefined
        
        #spy function for always()
        alwaysSpyF = undefined
        
        #spy function for done()
        doneSpyF = undefined
        
        #spy function for fail()
        failSpyF = undefined
        
        beforeEach ->
            alwaysSpyF = jasmine.createSpy()
            doneSpyF = jasmine.createSpy()
            failSpyF = jasmine.createSpy()
            
            deferred = new Greed.Deferred()
            
        it "always callbacks should executed on resolve()", ->
            deferred.always(alwaysSpyF)
            deferred.resolve()
            
            expect(alwaysSpyF).toHaveBeenCalled()
            return
        
        it "always callback should executed of reject()", ->
            deferred.always(alwaysSpyF)
            deferred.reject()
            
            expect(alwaysSpyF).toHaveBeenCalled()
            return
            
        it "always callback and done callback should both executed on resolve", ->
            deferred.always(alwaysSpyF)
            deferred.done(doneSpyF)
            deferred.fail(failSpyF)
            
            deferred.resolve()
            
            expect(alwaysSpyF).toHaveBeenCalled()
            expect(doneSpyF).toHaveBeenCalled()
            expect(failSpyF).not.toHaveBeenCalled()
        return
        
        it "always callback and fail callback should both executed on reject", ->
            deferred.always(alwaysSpyF)
            deferred.done(doneSpyF)
            deferred.fail(failSpyF)
            
            deferred.resolve()
            
            expect(alwaysSpyF).toHaveBeenCalled()
            expect(doneSpyF).not.toHaveBeenCalled()
            expect(failSpyF).toHaveBeenCalled()
        return
    return