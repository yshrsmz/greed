// Generated by CoffeeScript 1.5.0
(function() {
  var Greed, gr,
    __slice = [].slice;

  if (!('classList' in document.createElement('a'))) {
    throw new Error('Greed requires classList');
  }

  if (!('Greed' in window)) {
    Greed = {};
  }

  gr = Greed;

  /*
  determne type of given object
  */


  Greed.is = function(type, obj) {
    var clas;
    clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== void 0 && obj !== null && clas === type;
  };

  /*
  copy properties from args, if target does not have them
  */


  Greed.extend = function() {
    var arg, args, key, keys, target, _i, _j, _len, _len1;
    target = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    target || (target = {});
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      keys = Object.keys(arg);
      for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
        key = keys[_j];
        if (Greed.is('Object', arg[key]) || Greed.is('Array', arg[key])) {
          if (!target.hasOwnProperty(key)) {
            target[key] = gr.is("Array", arg[key]) ? [] : {};
          }
          gr.extend(target[key], arg[key]);
        } else {
          if (!target.hasOwnProperty(key)) {
            target[key] = arg[key];
          }
        }
      }
    }
    return target;
  };

  /*
  inherit prototype
  */


  Greed.inherit = function(Child, Parent) {
    var F;
    F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
  };

  /*
  convert object into query string
  */


  Greed.serializeData = function(data) {
    var key, keys, param, params, regexSpace, value, _i, _len;
    params = [];
    regexSpace = /%20/g;
    keys = Object.keys(data);
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      value = data[key];
      param = encodeURIComponent(key).replace(regexSpace, '+') + '=' + encodeURIComponent(value).replace(regexSpace, '+');
      params.push(param);
    }
    return params.join('&');
  };

  /*
  submit
  params should be object
  */


  Greed.submit = function(url, params) {
    var key, keys, tempForm, tempInput, _d, _i, _len;
    _d = document;
    keys = Object.keys(params || {});
    tempForm = _d.createElement('form');
    tempForm.setAttribute('action', url);
    tempForm.setAttribute('method', 'POST');
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      tempInput = _d.createElement('input');
      tempInput.setAttribute('type', 'text');
      tempInput.setAttribute('name', key);
      tempInput.setAttribute('value', params[key]);
      tempForm.appendChild(tempInput);
    }
    tempForm.submit();
  };

  /*
  wrapper method of window.location.
  params should be object, and it will be converted into query string
  */


  Greed.location = function(url, params) {
    document.location = url + (opts.url.indexOf('?') > -1 ? '&' : '?') + gr.serializeData(params);
  };

  /*
  class editing utilities
  */


  /*
  Add given class to the element.
  If clases parameter is array, add all classes to the element.
  */


  Greed.addClass = function(el, clases) {
    var clas, _i, _len;
    if (!el) {
      return;
    }
    if (!Array.isArray(clases)) {
      clases = [clases];
    }
    for (_i = 0, _len = clases.length; _i < _len; _i++) {
      clas = clases[_i];
      el.classList.add(clas);
    }
  };

  /*
  Remove given class from the element.
  If clases parameter is array, remove all classes from the element.
  */


  Greed.removeClass = function(el, clases) {
    var clas, _i, _len;
    if (!el) {
      return;
    }
    if (!Array.isArray(clases)) {
      clases = [clases];
    }
    for (_i = 0, _len = clases.length; _i < _len; _i++) {
      clas = clases[_i];
      el.classList.remove(clas);
    }
  };

  /*
  Assert if the element has given class.
  Class parameter can be array.
  Return true if the element has of of the given classes.
  If `hasAll` parameter is true, then return true when the element has all of the given classes.
  */


  Greed.hasClass = function(el, clases, hasAll) {
    var clas, _i, _j, _len, _len1;
    if (!el) {
      return;
    }
    if (!Array.isArray(clases)) {
      clases = [clases];
    }
    if (hasAll) {
      for (_i = 0, _len = clases.length; _i < _len; _i++) {
        clas = clases[_i];
        if (!el.classList.contains(clas)) {
          return false;
        }
      }
      return true;
    } else {
      for (_j = 0, _len1 = clases.length; _j < _len1; _j++) {
        clas = clases[_j];
        if (el.classList.contains(clas)) {
          return true;
        }
      }
      return false;
    }
  };

  Greed.toggleClass = function(el, clas) {
    if (!el) {
      return;
    }
    return el.classList.toggle(clas);
  };

  /*
  image lazy load
  */


  Greed.lazyLoadImg = function(imgDataAttribute) {
    var images;
    imgDataAttribute || (imgDataAttribute = "data-lazy-src");
    images = document.querySelectorAll("img[" + imgDataAttribute + "]");
    [].forEach.call(images, function(image) {
      image.src = image.getAttribute(imgDataAttribute);
    });
  };

  /*
  copy Greed methods into target object
  */


  Greed.installInto = function(target) {
    Greed.extend(target, Greed);
  };

  /*
  change alias of Greed
  */


  Greed.chAlias = function(newAlias, oldAlias) {
    if (oldAlias) {
      delete window[oldAlias];
    } else {
      delete window['gr'];
    }
    window[newAlias] = Greed;
  };

  window.Greed = Greed;

  window.gr = window.Greed;

}).call(this);
