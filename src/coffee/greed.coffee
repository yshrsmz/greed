
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

Greed.extend = (target, args...) ->
    target or= {}
    
    for arg in args
        keys = Object.keys arg
        for key in keys
            if Greed.is('Object', arg[key]) or Greed.is('Array', arg[key])
                if not target.hasOwnProperty key
                    target[key] = if _g.is "Array", arg[key] then [] else {}
                
                _g.extend target[key], arg[key]
            else
                if not target.hasOwnProperty key
                    target[key] = arg[key]

    target
    

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
Greed.lazyLoadImg = ->
    images = document.querySelectorAll "img[data-lazy-src]"
    
    [].forEach.call images, (image) ->
        image.src = image.getAttribute "data-lazy-src"
        return
        
    return
    
# export Greed to globals
window.Greed = Greed
window._g = window.Greed