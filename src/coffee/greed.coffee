
unless 'classList' of document.createElement('a')
    throw new Error 'Greed requires classList'
    
if not ('Greed' of window)
    Greed  = {}
    
gr = Greed
    
###
determne type of given object
###
Greed.is = (type, obj) ->
    clas = Object.prototype.toString.call(obj).slice 8, -1
    obj isnt undefined and obj isnt null and clas is type

###
copy properties from args, if target does not have them
###
Greed.fillData = (target, args...) ->
    target or= {}
    
    for arg in args
        keys = Object.keys arg
        for key in keys
            if Greed.is('Object', arg[key]) or Greed.is('Array', arg[key])
                if not target.hasOwnProperty key
                    target[key] = if gr.is "Array", arg[key] then [] else {}
                
                gr.fillData target[key], arg[key]
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
    return params.join('&')
    
###
submit
params should be object
###
Greed.submit = (url, params) ->
    _d = document
    keys = Object.keys(params or {})
    
    tempForm = _d.createElement 'form'
    tempForm.setAttribute 'action', url
    tempForm.setAttribute 'method', 'POST'
    
    for key in keys
        tempInput = _d.createElement 'input'
        tempInput.setAttribute 'type', 'text'
        tempInput.setAttribute 'name', key
        tempInput.setAttribute 'value', params[key]
        tempForm.appendChild tempInput
        
    tempForm.submit()
    return
    
###
wrapper method of window.location.
params should be object, and it will be converted into query string
###
Greed.location = (url, params) ->
    document.location = url + (if opts.url.indexOf('?') > -1 then '&' else '?') + gr.serializeData params
    return

###
class editing utilities
###

###
Add given class to the element.
If clases parameter is array, add all classes to the element.
###
Greed.addClass = (el, clases) ->
    if not el then return
    
    if not Array.isArray clases then clases = [clases]
    
    el.classList.add clas for clas in clases
    
    return

###
Remove given class from the element.
If clases parameter is array, remove all classes from the element.
###
Greed.removeClass = (el, clases) ->
    if not el then return
    
    if not Array.isArray clases then clases = [clases]
    
    el.classList.remove clas for clas in clases
    
    return
    
###
Assert if the element has given class.
Class parameter can be array.
Return true if the element has of of the given classes.
If `hasAll` parameter is true, then return true when the element has all of the given classes.
###
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
    
###
copy Greed methods into target object
###
Greed.installInto = (target) ->
    Greed.fillData target, Greed
    return
    
###
change alias of Greed
###
Greed.chAlias = (newAlias, oldAlias) ->
    if oldAlias then delete window[oldAlias] else delete window['gr']
    window[newAlias] = Greed
    return
    
# export Greed to globals
window.Greed = Greed
window.gr = window.Greed