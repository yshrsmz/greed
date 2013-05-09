

describe "ajaxSettings", ->
    settings = gr.AjaxCore::defaults
    
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
            
    it "should return rejected Promise object, when called without arguments", ->
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
        
        promise = gr.ajax()
        
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
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
        
        promise = gr.ajax('http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1')
        
        expect(promise.constructor.name).toEqual "Promise"
        
        promise
            .done((res) ->
                doneSpy()
                serverResponse = res
            ).fail(failSpy)
            .always(alwaysSpy)
        
        waitsFor(->
            not not serverResponse
        , 'get server response', 2000)
        
        runs(->
            expect(doneSpy).toHaveBeenCalled()
            expect(failSpy).not.toHaveBeenCalled()
            expect(alwaysSpy).toHaveBeenCalled()
            expect(promise.state()).toEqual "resolved"
        )
        
        return
        
    it "should process normally, if callbacks are given as arguments", ->
        serverResponse = null
        promise = undefined
        isCompleted = false
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
        url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1'
        runs( ->
            promise = gr.ajax(url, {
                    success: (data) ->
                        doneSpy()
                        serverResponse = data
                        isCompleted = true
                        return
                    error: failSpy
                    complete: alwaysSpy
                })
        )
        
        waitsFor(->
            not not serverResponse
        , 'get server response', 2000)
        
        runs(->
            expect(doneSpy).toHaveBeenCalled()
            expect(failSpy).not.toHaveBeenCalled()
            expect(alwaysSpy).toHaveBeenCalled()
            expect(promise.state()).toEqual 'resolved'
        )
        
        return
        
    it "should call onTimeout funciton, when ajax call timed out", ->
        serverResponse = null
        promise = undefined
        isCompleted = false
        promise = undefined
        url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=yshrsmzajax-yoshimurasei.dotcloud.com/ajax-test'
        
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
        timeoutSpy = jasmine.createSpy()
        
        runs( ->
            promise = gr.ajax(url, {
                    onTimeout: ->
                        timeoutSpy()
                        isCompleted = true
                        return
                    timeoutDuration: 1000
                }).done(doneSpy).fail(failSpy).always(alwaysSpy)
            return
        )
            
        waitsFor ->
            isCompleted
        , 'request does not timed out', 2000
        
        runs( ->
            expect(doneSpy).not.toHaveBeenCalled()
            expect(failSpy).not.toHaveBeenCalled()
            expect(alwaysSpy).not.toHaveBeenCalled()
            expect(timeoutSpy).toHaveBeenCalled()
        )
        
        return
        
describe "ajaxJSON", ->
    
    it "should return response as Object", ->
        
        serverResponse = null
        isCompleted = false
        promise = undefined
        url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1'
        doneSpy = undefined
        failSpy = undefined
        alwaysSpy = undefined
        
        doneSpy = jasmine.createSpy()
        failSpy = jasmine.createSpy()
        alwaysSpy = jasmine.createSpy()
        runs( ->
            promise = gr.ajaxJSON(url)
            
            expect(promise.constructor.name).toEqual 'Promise'
        
            promise.done( (data) ->
                console.log(data)
                doneSpy()
                expect(gr.is('Object', data)).toBeTruthy()
                serverResponse = data
                isCompleted = true
                return
            ).fail(failSpy).always(alwaysSpy)
        )
        
        waitsFor(->
            isCompleted
        , 'get server response', 2000)
        
        runs( ->
            expect(doneSpy).toHaveBeenCalled()
            expect(failSpy).not.toHaveBeenCalled()
            expect(alwaysSpy).toHaveBeenCalled()
            expect(promise.state()).toEqual 'resolved'
        )
        
        return
    return