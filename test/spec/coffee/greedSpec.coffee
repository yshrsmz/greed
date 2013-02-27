

describe "Greed", ->
    it "should exist as global variable", ->
        expect("Greed" of window).toBe true
        return
    
    it "gr is short hand for Greed, also exist as global variable", ->
        expect("gr" of window).toBe true
        return
        
    return
    
describe "gr.is(type, obj)", ->
    func = `function(){}`
    it "gr.is(): Object", ->
        
        expect(gr.is("Object", new Object())).toBe true
        expect(gr.is("Object", {})).toBe true
        
        expect(gr.is("Object", func)).toBe false
        expect(gr.is("Object", [])).toBe false
        expect(gr.is("Object", "Greed")).toBe false
        expect(gr.is("Object", undefined)).toBe false
        expect(gr.is("Object", null)).toBe false
        expect(gr.is("Object", new Date())).toBe false
        expect(gr.is("Object", 1)).toBe false
        expect(gr.is("Object", window)).toBe false
        return
        
    it "gr.is(): Function", ->
        
        expect(gr.is("Function", func)).toBe true
        
        expect(gr.is("Function", new Object())).toBe false
        expect(gr.is("Function", {})).toBe false
        expect(gr.is("Function", [])).toBe false
        expect(gr.is("Function", "Greed")).toBe false
        expect(gr.is("Function", undefined)).toBe false
        expect(gr.is("Function", null)).toBe false
        expect(gr.is("Function", new Date())).toBe false
        expect(gr.is("Function", 1)).toBe false
        expect(gr.is("Function", window)).toBe false
        return
        
    it "gr.is(): String", ->
        
        expect(gr.is("String", "Greed")).toBe true
        
        expect(gr.is("String", func)).toBe false
        expect(gr.is("String", new Object())).toBe false
        expect(gr.is("String", {})).toBe false
        expect(gr.is("String", [])).toBe false
        expect(gr.is("String", undefined)).toBe false
        expect(gr.is("String", null)).toBe false
        expect(gr.is("String", new Date())).toBe false
        expect(gr.is("String", 1)).toBe false
        expect(gr.is("String", window)).toBe false
        return
        
    it "gr.is(): Number", ->
        
        expect(gr.is("Number", 1)).toBe true
        
        expect(gr.is("Number", "Greed")).toBe false
        expect(gr.is("Number", func)).toBe false
        expect(gr.is("Number", new Object())).toBe false
        expect(gr.is("Number", {})).toBe false
        expect(gr.is("Number", [])).toBe false
        expect(gr.is("Number", undefined)).toBe false
        expect(gr.is("Number", null)).toBe false
        expect(gr.is("Number", new Date())).toBe false
        expect(gr.is("Number", window)).toBe false
        return
        
    it "gr.is(): Array", ->
        
        expect(gr.is("Array", [])).toBe true
        
        expect(gr.is("Array", 1)).toBe false
        expect(gr.is("Array", "Greed")).toBe false
        expect(gr.is("Array", func)).toBe false
        expect(gr.is("Array", new Object())).toBe false
        expect(gr.is("Array", {})).toBe false
        expect(gr.is("Array", undefined)).toBe false
        expect(gr.is("Array", null)).toBe false
        expect(gr.is("Array", new Date())).toBe false
        expect(gr.is("Array", window)).toBe false
        return
    return
    
describe "gr.hasClass()", ->
    testElement = undefined
    
    beforeEach ->
        testElement = sandbox
            class: 'foo bar'
    
    it "gr.hasClass() can tell whether or not given element has given class", ->
        expect(gr.hasClass(testElement, "foo")).toBe true
        expect(gr.hasClass(testElement, "bar")).toBe true
        expect(gr.hasClass(testElement, "hoo")).toBe false
        
        return
        
    it "gr.hasClass() can take array of class as second argument", ->
        expect(gr.hasClass(testElement, ["foo", "bar"])).toBe true
        expect(gr.hasClass(testElement, ["foo", "hoo"])).toBe true
        expect(gr.hasClass(testElement, ["hoo", "foo"])).toBe true
        expect(gr.hasClass(testElement, ["hoo", "var"])).toBe false
        
        return
        
    it "if 3rd argument is true, gr.hasClass() returns true only if the given element has all of the given classes", ->
        expect(gr.hasClass(testElement, "foo", true)).toBe true
        expect(gr.hasClass(testElement, ["foo", "bar"], true)).toBe true
        expect(gr.hasClass(testElement, ["bar", "foo"], true)).toBe true
        expect(gr.hasClass(testElement, ["foo", "hoo"], true)).toBe false
        expect(gr.hasClass(testElement, ["hoo", "foo"], true)).toBe false
        expect(gr.hasClass(testElement, ["hoo", "var"], true)).toBe false
        
        return
        
    return
    
describe "gr.addClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox()
        
    it "gr.addClass() adds given class to given element", ->
        gr.addClass node, "foo"
        expect(node).toHaveClass "foo"
        
    it "gr.addClass() can take array of class as second argument, and add those classes to given element", ->
        gr.addClass node, ['foo', 'bar']
        expect(node.className).toEqual "foo bar"
        
        return
        
    return
    
describe "gr.removeClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox
            class: "foo bar"
        
    it "gr.removeClass() removes given class from given argument", ->
        gr.removeClass node, "foo"
        expect(node.className).toEqual "bar"
        
        return
        
    it "gr.removeClass() can take array of class as second argument, and reove those classes from given element", ->
        gr.removeClass node, ["foo", "bar"]
        expect(node.className).toEqual ""
        
    return
    
describe "gr.toggleClass()", ->
    node = undefined
    
    beforeEach ->
        node = sandbox()
        
    it "gr.toggleClass() remove class from given element, if the class exists", ->
        node.className = "foo"
        gr.toggleClass node, "foo"
        expect(node.className).toEqual ""
        
        node.className = "foo bar"
        gr.toggleClass node, "bar"
        expect(node.className).toEqual "foo"
        
        return
        
    it "gr.toggleClass() adds class to given element, if the class does not exist", ->
        gr.toggleClass node, "foo"
        expect(node.className).toEqual "foo"
        
        node.className = "bar"
        gr.toggleClass node, "foo"
        expect(node.className).toEqual "bar foo"
        
        return
        
describe "gr.fillData", ->
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
            
        result = gr.fillData target, src1
        
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
            
        result = gr.fillData target, src1, src2
        
        expect(result).toEqual answer
        
        return
        
    return