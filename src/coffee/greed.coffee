
unless 'classList' of document.createElement('a')
    throw new Error 'Greed requires classList'
    
Greed  = ->
    console.log 'greed.js is my personal utility library'
    console.log 'core module '
    return
    
###
determne type of given object
###
Greed.is = (type, obj) ->
    clas = Object.prototype.toString.call(obj).slice 8, -1
    obj isnt undefined and obj isnt null and clas is type

Greed.is.prototype.TYPE_FUNCTION = "Function"
Greed.is.prototype.TYPE_STRING = "String"
Greed.is.prototype.TYPE_DATE = "Date"
Greed.is.prototype.TYPE_ARRAY = "Array"
Greed.is.prototype.TYPE_OBJECT = "Object"
Greed.is.prototype.TYPE_NUMBER = "Number"
Greed.is.prototype.TYPE_BOOLEAN = "Boolean"

Greed.fillData = (target, args...) ->
    target or= {}
    
    for arg in args
        keys = Object.keys arg
        for key in keys
            if Greed.is('Object', arg[key]) or Greed.is('Array', arg[key])
                if not target.hasOwnProperty key
                    target[key] = if _g.is "Array", arg[key] then [] else {}
                
                _g.fillData target[key], arg[key]
            else
                if not target.hasOwnProperty key
                    target[key] = arg[key]

    target
    
###
extend prototype
###
Greed.extend = (Child, Parent) ->
    F = ->
    F:: = Parent::
    Child:: = new F()
    Child::constructor = Child
    Child.uber = Parent::
    return
    
###
convert object into query string
###
Greed.serializeData = (data) ->
    params = []
    regexSpace = /%20/g
    keys = Object.keys data
    
    for key in keys
        value = data[key]
        param = encodeURIComponent(key).replace(regexSpace, '+') +
            '=' + encodeURIComponent(value).replace(regexSpace, '+')
        params.push param
        return
    return params.join('&')
    

###
class editing utilities
###
Greed.addClass = (el, clases) ->
    if not el then return
    
    if not Array.isArray clases then clases = [clases]
    
    el.classList.add clas for clas in clases
    
    return

Greed.removeClass = (el, clases) ->
    if not el then return
    
    if not Array.isArray clases then clases = [clases]
    
    el.classList.remove clas for clas in clases
    
    return
    
Greed.hasClass = (el, clases, hasAll) ->
    if not el then return
        
    if not Array.isArray(clases) then clases = [clases]
    
    if hasAll
        for clas in clases
            if not el.classList.contains clas
                return false
                
        return true
    else
        for clas in clases
            if el.classList.contains clas
                return true
                
        return false
    
Greed.toggleClass = (el, clas) ->
    if not el then return
    el.classList.toggle clas
    
###
image lazy load
###
Greed.lazyLoadImg = (imgDataAttribute) ->
    imgDataAttribute or= "data-lazy-src"
    images = document.querySelectorAll "img[" + imgDataAttribute + "]"
    
    [].forEach.call images, (image) ->
        image.src = image.getAttribute imgDataAttribute
        return
        
    return
    
# export Greed to globals
window.Greed = Greed
window._g = window.Greed