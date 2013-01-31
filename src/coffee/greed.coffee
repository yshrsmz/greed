Greed  = ->
    console.log 'greed.js is my personal utility library'
    console.log 'core module '
    return
    
Greed.is = (type, obj) ->
    clas = Object.prototype.toString.call(obj).slice 8, -1
    obj isnt undefined and obj isnt null and clas is type

Greed.is.prototype.TYPE_FUNCTION = "Function"
Greed.is.prototype.TYPE_STRING = "String"
Greed.is.prototype.TYPE_DATE = "Date"
Greed.is.prototype.TYPE_ARRAY = "Array"
Greed.is.prototype.TYPE_OBJECT = "Object"
Greed.is.prototype.TYPE_NUMBER = "Number"
    
# export Greed to globals
window.Greed = Greed
window._g = window.Greed