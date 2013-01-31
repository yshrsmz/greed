describe "Greed", ->
    it "should exist as global variable", ->
        expect("Greed" of window).toBe true
        return
    
    it "_g is short hand for Greed, also exist as global variable", ->
        expect("_g" of window).toBe true
        return
        
    return
    
describe "_g.is(type, obj)", ->
    func = `function(){}`
    it "_g.is(): Object", ->
        expect(_g.is.prototype.TYPE_OBJECT).toEqual "Object"
        
        expect(_g.is("Object", new Object())).toBe true
        expect(_g.is("Object", {})).toBe true
        
        expect(_g.is("Object", func)).toBe false
        expect(_g.is("Object", [])).toBe false
        expect(_g.is("Object", "Greed")).toBe false
        expect(_g.is("Object", undefined)).toBe false
        expect(_g.is("Object", null)).toBe false
        expect(_g.is("Object", new Date())).toBe false
        expect(_g.is("Object", 1)).toBe false
        expect(_g.is("Object", window)).toBe false
        return
        
    it "_g.is(): Function", ->
        expect(_g.is.prototype.TYPE_FUNCTION).toEqual "Function"
        
        expect(_g.is("Function", func)).toBe true
        
        expect(_g.is("Function", new Object())).toBe false
        expect(_g.is("Function", {})).toBe false
        expect(_g.is("Function", [])).toBe false
        expect(_g.is("Function", "Greed")).toBe false
        expect(_g.is("Function", undefined)).toBe false
        expect(_g.is("Function", null)).toBe false
        expect(_g.is("Function", new Date())).toBe false
        expect(_g.is("Function", 1)).toBe false
        expect(_g.is("Function", window)).toBe false
        return
        
    it "_g.is(): String", ->
        expect(_g.is.prototype.TYPE_STRING).toEqual "String"
        
        expect(_g.is("String", "Greed")).toBe true
        
        expect(_g.is("String", func)).toBe false
        expect(_g.is("String", new Object())).toBe false
        expect(_g.is("String", {})).toBe false
        expect(_g.is("String", [])).toBe false
        expect(_g.is("String", undefined)).toBe false
        expect(_g.is("String", null)).toBe false
        expect(_g.is("String", new Date())).toBe false
        expect(_g.is("String", 1)).toBe false
        expect(_g.is("String", window)).toBe false
        return
        
    it "_g.is(): Number", ->
        expect(_g.is.prototype.TYPE_NUMBER).toEqual "Number"
        
        expect(_g.is("Number", 1)).toBe true
        
        expect(_g.is("Number", "Greed")).toBe false
        expect(_g.is("Number", func)).toBe false
        expect(_g.is("Number", new Object())).toBe false
        expect(_g.is("Number", {})).toBe false
        expect(_g.is("Number", [])).toBe false
        expect(_g.is("Number", undefined)).toBe false
        expect(_g.is("Number", null)).toBe false
        expect(_g.is("Number", new Date())).toBe false
        expect(_g.is("Number", window)).toBe false
        return
        
    it "_g.is(): Array", ->
        expect(_g.is.prototype.TYPE_ARRAY).toEqual "Array"
        
        expect(_g.is("Array", [])).toBe true
        
        expect(_g.is("Array", 1)).toBe false
        expect(_g.is("Array", "Greed")).toBe false
        expect(_g.is("Array", func)).toBe false
        expect(_g.is("Array", new Object())).toBe false
        expect(_g.is("Array", {})).toBe false
        expect(_g.is("Array", undefined)).toBe false
        expect(_g.is("Array", null)).toBe false
        expect(_g.is("Array", new Date())).toBe false
        expect(_g.is("Array", window)).toBe false
        return
    return