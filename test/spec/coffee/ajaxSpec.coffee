describe "ajaxSettings", ->
    settings = _g.AjaxCore::defaults
    
    it "should 'POST' be default value of type", ->
        expect(settings.type).toEqual "POST"
        return
        
    it "should empty string be default value of url", ->
        expect(settings.url).toEqual ""
        return
        
    it "should null be default value of data", ->
        expect(settings.data).toBeNull()
        return
        
    it "should 'text' be default value of dataType", ->
        expect(settings.dataType).toBe "text"
        return
        
    it "should true be default value of async", ->
        expect(settings.async).toBeTruthy()
        return
        
    it "should false be default value of cache", ->
        expect(settings.cache).toBeFalsy()
        return
        
    it "should 'application/x-www-form-urlencoded' be default value of contentType", ->
        expect(settings.contentType).toEqual "application/x-www-form-urlencoded"
        return
        
    it "should null be default value of success", ->
        expect(settings.success).toBeNull()
        return
        
    it "should null be default value of error", ->
        expect(settings.error).toBeNull()
        return
        
    it "should null be default value of complete", ->
        expect(settings.complete).toBeNull()
        return
        
    it "should 60000 be default value of timeoutDuration", ->
        expect(settings.timeoutDuration).toEqual 60000
        return
        
    it "should accepts be same object with given", ->
        sample = 
            text: "text/plain"
            html: "text/html"
            xml: "application/xml, text/xml"
            json: "application/json, text/javascript"
            
        expect(settings.accepts).toEqual sample
        return
    return

describe "ajax", ->
    doneSpy = undefined
    failSpy = undefined
    alwaysSpy = undefined
    
    beforeEach ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
    
    it "should return rejected Promise object, when called without arguments", ->
        
        promise = _g.ajax()
        
        promise
            .done(doneSpy)
            .fail(failSpy)
            .always(alwaysSpy)
        
        expect(promise.constructor.name).toEqual "Promise"
        expect(promise.state()).toEqual "rejected"
        
        expect(doneSpy).not.toHaveBeenCalled()
        expect(failSpy).toHaveBeenCalled()
        expect(alwaysSpy).toHaveBeenCalled()
        
        return
        
    it "should return pending Promise object, when called with url or parameter object", ->
        serverResponse = null
        
        promise = _g.ajax('/test/data/ajax_test.json')
        
        expect(promise.constructor.name).toEqual "Promise"
        
        promise
            .done((res) ->
                doneSpy()
                serverResponse = res
            ).fail(failSpy)
            .always(alwaysSpy)
        
        
        #expect(promise.state()).toEqual "rejected"
        
        waitsFor(->
            not not serverResponse
        , 'get server response', 2000)
        
        runs(->
            expect(doneSpy).toHaveBeenCalled()
            expect(failSpy).not.toHaveBeenCalled()
            expect(alwaysSpy).toHaveBeenCalled()
        )
        
        return