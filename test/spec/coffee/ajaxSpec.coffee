describe "Ajax", ->
    it "AjaxCore should exist in Greed", ->
        expect("AjaxCore" of window.Greed).toBe true
        return
        
    return
    
    it "ajax() should exist in Greed", ->
        expect(("ajax" of window.Greed) and typeof window.Greed.ajax is "function").toBe true
        return
        
    return
    
    it "ajaxJSON() should exist in Greed", ->
        expect(("ajaxJSON" of window.Greed) and typeof window.Greed.ajaxJSON is "function").toBe true
        return
    return