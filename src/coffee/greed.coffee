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

###
class editing utilities
###
Greed.addClass = (el, clas) ->
    el?.classList.add clas
    return

Greed.removeClass = (el, clas) ->
    el?.classList.remove clas
    return
    
Greed.hasClass = (el, clases) ->
    if not el then return
        
    if not Array.isArray(clases) then clases = [clases]
        
    for clas in clases
        if el.classList.contains clas
            return true
            
    return false
    
Greed.toggleClass = (el, clas) ->
    el?.classList.toggle clas
    
# export Greed to globals
window.Greed = Greed
window._g = window.Greed