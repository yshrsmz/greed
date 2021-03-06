// Generated by CoffeeScript 1.5.0
(function() {

  describe("ajaxSettings", function() {
    var settings;
    settings = gr.AjaxCore.prototype.defaults;
    it("should 'POST' be default value of type", function() {
      expect(settings.type).toEqual("POST");
    });
    it("should empty string be default value of url", function() {
      expect(settings.url).toEqual("");
    });
    it("should null be default value of data", function() {
      expect(settings.data).toBeNull();
    });
    it("should 'text' be default value of dataType", function() {
      expect(settings.dataType).toBe("text");
    });
    it("should true be default value of async", function() {
      expect(settings.async).toBeTruthy();
    });
    it("should false be default value of cache", function() {
      expect(settings.cache).toBeFalsy();
    });
    it("should 'application/x-www-form-urlencoded' be default value of contentType", function() {
      expect(settings.contentType).toEqual("application/x-www-form-urlencoded");
    });
    it("should null be default value of success", function() {
      expect(settings.success).toBeNull();
    });
    it("should null be default value of error", function() {
      expect(settings.error).toBeNull();
    });
    it("should null be default value of complete", function() {
      expect(settings.complete).toBeNull();
    });
    it("should 60000 be default value of timeoutDuration", function() {
      expect(settings.timeoutDuration).toEqual(60000);
    });
    it("should accepts be same object with given", function() {
      var sample;
      sample = {
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      };
      expect(settings.accepts).toEqual(sample);
    });
  });

  describe("ajax", function() {
    it("should return rejected Promise object, when called without arguments", function() {
      var alwaysSpy, doneSpy, failSpy, promise;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      alwaysSpy = jasmine.createSpy();
      promise = gr.ajax();
      promise.done(doneSpy).fail(failSpy).always(alwaysSpy);
      expect(promise.constructor.name).toEqual("Promise");
      expect(promise.state()).toEqual("rejected");
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should return pending Promise object, when called with url or parameter object", function() {
      var alwaysSpy, doneSpy, failSpy, promise, serverResponse;
      serverResponse = null;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      alwaysSpy = jasmine.createSpy();
      promise = gr.ajax('http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1');
      expect(promise.constructor.name).toEqual("Promise");
      promise.done(function(res) {
        serverResponse = res;
        doneSpy();
      }).fail(failSpy).always(alwaysSpy);
      waitsFor(function() {
        return !!serverResponse;
      }, 'get server response', 3000);
      runs(function() {
        expect(doneSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
        expect(alwaysSpy).toHaveBeenCalled();
        return expect(promise.state()).toEqual("resolved");
      });
    });
    it("should process normally, if callbacks are given as arguments", function() {
      var alwaysSpy, doneSpy, failSpy, isCompleted, promise, serverResponse, url;
      serverResponse = null;
      promise = void 0;
      isCompleted = false;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      alwaysSpy = jasmine.createSpy();
      url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1';
      runs(function() {
        return promise = gr.ajax(url, {
          success: function(data) {
            doneSpy();
            serverResponse = data;
            isCompleted = true;
          },
          error: failSpy,
          complete: alwaysSpy
        });
      });
      waitsFor(function() {
        return !!serverResponse;
      }, 'get server response', 2000);
      runs(function() {
        expect(doneSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
        expect(alwaysSpy).toHaveBeenCalled();
        return expect(promise.state()).toEqual('resolved');
      });
    });
    return it("should call onTimeout funciton, when ajax call timed out", function() {
      var alwaysSpy, doneSpy, failSpy, isCompleted, promise, serverResponse, timeoutSpy, url;
      serverResponse = null;
      promise = void 0;
      isCompleted = false;
      promise = void 0;
      url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=yshrsmzajax-yoshimurasei.dotcloud.com/ajax-test';
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      alwaysSpy = jasmine.createSpy();
      timeoutSpy = jasmine.createSpy();
      runs(function() {
        promise = gr.ajax(url, {
          onTimeout: function() {
            timeoutSpy();
            isCompleted = true;
          },
          timeoutDuration: 1000
        }).done(doneSpy).fail(failSpy).always(alwaysSpy);
      });
      waitsFor(function() {
        return isCompleted;
      }, 'request does not timed out', 2000);
      runs(function() {
        expect(doneSpy).not.toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
        expect(alwaysSpy).not.toHaveBeenCalled();
        return expect(timeoutSpy).toHaveBeenCalled();
      });
    });
  });

  describe("ajaxJSON", function() {
    it("should return response as Object", function() {
      var alwaysSpy, doneSpy, failSpy, isCompleted, promise, serverResponse, url;
      serverResponse = null;
      isCompleted = false;
      promise = void 0;
      url = 'http://www51.atpages.jp/yshrsmz/proxy/index.php?url=http://github.com/&full_headers=1&full_status=1';
      doneSpy = void 0;
      failSpy = void 0;
      alwaysSpy = void 0;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      alwaysSpy = jasmine.createSpy();
      runs(function() {
        promise = gr.ajaxJSON(url);
        expect(promise.constructor.name).toEqual('Promise');
        return promise.done(function(data) {
          console.log(data);
          doneSpy();
          expect(gr.is('Object', data)).toBeTruthy();
          serverResponse = data;
          isCompleted = true;
        }).fail(failSpy).always(alwaysSpy);
      });
      waitsFor(function() {
        return isCompleted;
      }, 'get server response', 2000);
      runs(function() {
        expect(doneSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
        expect(alwaysSpy).toHaveBeenCalled();
        return expect(promise.state()).toEqual('resolved');
      });
    });
  });

}).call(this);
