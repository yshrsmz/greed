

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
    
describe "_g.hasClass()", ->
    testElement = undefined
    
    beforeEach ->
        testElement = sandbox
            class: 'foo bar'
    
    it "_g.hasClass() can tell whether or not given element has given class", ->
        expect(_g.hasClass(testElement, "foo")).toBe true
        expect(_g.hasClass(testElement, "bar")).toBe true
        expect(_g.hasClass(testElement, "hoo")).toBe false
        
        return
        
    it "_g.hasClass() can take array of class as second argument", ->
        expect(_g.hasClass(testElement, ["foo", "bar"])).toBe true
        expect(_g.hasClass(testElement, ["foo", "hoo"])).toBe true
        expect(_g.hasClass(testElement, ["hoo", "foo"])).toBe true
        expect(_g.hasClass(testElement, ["hoo", "var"])).toBe false
        
        return
        
    it "if 3rd argument is true, _g.hasClass() returns true only if the given element has all of the given classes", ->
        expect(_g.hasClass(testElement, "foo", true)).toBe true
        expect(_g.hasClass(testElement, ["foo", "bar"], true)).toBe true
        expect(_g.hasClass(testElement, ["bar", "foo"], true)).toBe true
        expect(_g.hasClass(testElement, ["foo", "hoo"], true)).toBe false
        expect(_g.hasClass(testElement, ["hoo", "foo"], true)).toBe false
        expect(_g.hasClass(testElement, ["hoo", "var"], true)).toBe false
        
        return
        
    return
    
describe "_g.addClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox()
        
    it "_g.addClass() adds given class to given element", ->
        _g.addClass node, "foo"
        expect(node).toHaveClass "foo"
        
    it "_g.addClass() can take array of class as second argument, and add those classes to given element", ->
        _g.addClass node, ['foo', 'bar']
        expect(node.className).toEqual "foo bar"
        
        return
        
    return
    
describe "_g.removeClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox
            class: "foo bar"
        
    it "_g.removeClass() removes given class from given argument", ->
        _g.removeClass node, "foo"
        expect(node.className).toEqual "bar"
        
        return
        
    it "_g.removeClass() can take array of class as second argument, and reove those classes from given element", ->
        _g.removeClass node, ["foo", "bar"]
        expect(node.className).toEqual ""
        
    return
    
describe "_g.toggleClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox()
        
    it "_g.toggleClass() remove class from given element, if the class exists", ->
        node.className = "foo"
        _g.toggleClass node, "foo"
        expect(node.className).toEqual ""
        
        node.className = "foo bar"
        _g.toggleClass node, "bar"
        expect(node.className).toEqual "foo"
        
        return
        
    it "_g.toggleClass() adds class to given element, if the class does not exist", ->
        _g.toggleClass node, "foo"
        expect(node.className).toEqual "foo"
        
        node.className = "bar"
        _g.toggleClass node, "foo"
        expect(node.className).toEqual "bar foo"
        
        return
        
describe "_g.fillData", ->
    target = undefined
    src1 = undefined
    src2 = undefined
    answer = undefined
    
    beforeEach ->
        target = undefined
        src1 = undefined
        src2 = undefined
        answer = undefined
        
    it "should merge src into target object", ->
        target = 
            foo: true,
            bar: '1',
            hoo: 123,
            fuga: 'fuga'
            
        src1 =
            foo_1: false,
            bar_1: '2',
            hoo_1: 456,
            fuga_1: 'fuga_1'
            
        answer =
            foo: true,
            bar: '1',
            hoo: 123,
            fuga: 'fuga',
            foo_1: false,
            bar_1: '2',
            hoo_1: 456,
            fuga_1: 'fuga_1'
            
        result = _g.fillData target, src1
        
        expect(result).toEqual answer
        
        return
        
    it "should merge multiple src into target, if given", ->
        target = 
            foo: true,
            bar: '1',
            hoo: 123,
            fuga: 'fuga'
            
        src1 =
            foo_1: false,
            bar_1: '2',
            hoo_1: 456,
            fuga_1: 'fuga_1'
            
        src2 =
            foo_2: false,
            bar_2: '3',
            hoo_2: 789,
            fuga_2: 'fuga_2'
            
        answer =
            foo: true,
            bar: '1',
            hoo: 123,
            fuga: 'fuga',
            foo_1: false,
            bar_1: '2',
            hoo_1: 456,
            fuga_1: 'fuga_1',
            foo_2: false,
            bar_2: '3',
            hoo_2: 789,
            fuga_2: 'fuga_2'
            
        result = _g.fillData target, src1, src2
        
        expect(result).toEqual answer
        
        return
        
    return