// Generated by CoffeeScript 1.5.0
(function() {
  var root,
    __slice = [].slice;

  root = this;

  describe("Deferred", function() {
    var dfr;
    dfr = void 0;
    beforeEach(function() {
      return dfr = new Greed.Deferred();
    });
    it("should exist in Greed", function() {
      expect("Deferred" in window.Greed).toBe(true);
    });
    it("should initialize to state 'pending'", function() {
      expect(dfr.state()).toEqual("pending");
    });
    it("should change its state to 'resolved' when resolved", function() {
      dfr.resolve();
      expect(dfr.state()).toEqual("resolved");
    });
    it("should change its state to 'rejected' when rejected", function() {
      dfr.reject();
      expect(dfr.state()).toEqual("rejected");
    });
    it("should not change state after resolved or rejected", function() {
      dfr.resolve();
      dfr.reject();
      expect(dfr.state()).toEqual("resolved");
      dfr = new Greed.Deferred();
      dfr.reject();
      dfr.resolve();
      expect(dfr.state()).toEqual("rejected");
    });
    it("should execute done & always callbacks after resolving, and not execute fail callbacks", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.done(doneSpy).fail(failSpy).always(alwaysSpy);
      dfr.resolve();
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should execute fail & always callbacks after rejecting, and not execute done callbacks", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.done(doneSpy).fail(failSpy).always(alwaysSpy);
      dfr.reject();
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should execute done callbacks added with then when resolving", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.then(doneSpy, failSpy);
      dfr.resolve();
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
    });
    it("should execute fail callbacks added with then when rejecting", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.then(doneSpy, failSpy);
      dfr.reject();
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
    });
    it("should execute done callbacks when added after resolved, and not execute fail callbacks", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.resolve();
      dfr.done(doneSpy).fail(failSpy).always(alwaysSpy);
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should execute fail callbacks when added after rejected, and not execute done callbacks", function() {
      var alwaysSpy, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      dfr.reject();
      dfr.done(doneSpy).fail(failSpy).always(alwaysSpy);
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should resolve/reject with context", function() {
      var context;
      context = new Array();
      dfr.done(function() {
        return expect(this).toEqual(context);
      });
      dfr.resolveWith(context);
      dfr = new Greed.Deferred();
      dfr.fail(function() {
        return expect(this).toEqual(context);
      });
      dfr.rejectWith(context);
    });
    it("should resolve with arguments", function() {
      dfr.done(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual("foo");
        expect(this).toEqual(root);
      });
      dfr.resolve(123, "foo");
    });
    it("should reject with arguments", function() {
      dfr.fail(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual("foo");
        expect(this).toEqual(root);
      });
      dfr.reject(123, "foo");
    });
    it("should resolve with context and arguments", function() {
      var context;
      context = new Array();
      dfr.fail(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual("foo");
        expect(this).toEqual(context);
      });
      dfr.resolveWith(context, 123, "foo");
    });
    it("should reject with context and arguments", function() {
      var context;
      context = new Array();
      dfr.fail(function(firstArg, secondArg) {
        expect(firstArg).toEqual(123);
        expect(secondArg).toEqual("foo");
        expect(this).toEqual(context);
      });
      dfr.rejectWith(context, 123, "foo");
    });
    it("should fire done with context and arguments after resolving", function() {
      var alwaysSpy, context, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      context = new Array();
      dfr.resolveWith(context, 12345);
      dfr.done(function(firstArg) {
        doneSpy();
        return expect(firstArg).toEqual(12345);
      });
      expect(doneSpy).toHaveBeenCalled();
    });
    it("should fire fail with context and arguments after rejecting", function() {
      var alwaysSpy, context, doneSpy, failSpy;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      context = new Array();
      dfr.rejectWith(context, 12345);
      dfr.fail(function(firstArg) {
        failSpy();
        return expect(firstArg).toEqual(12345);
      });
      expect(failSpy).toHaveBeenCalled();
    });
    it("should execute function passed to constructor", function() {
      var constructorSpy, doneSpy, passedParam;
      constructorSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      passedParam = void 0;
      dfr = new Greed.Deferred(function(param) {
        constructorSpy();
        passedParam = param;
        expect(param).toEqual(this);
        return this.done(doneSpy);
      });
      expect(constructorSpy).toHaveBeenCalled();
      expect(passedParam).toEqual(dfr);
      dfr.resolve();
      expect(doneSpy).toHaveBeenCalled();
    });
    describe("Deferred.then() behavior", function() {
      var defer, promise;
      defer = void 0;
      promise = void 0;
      beforeEach(function() {
        defer = new Greed.Deferred();
        return promise = defer.promise();
      });
      it("should let you create a promise", function() {
        expect(promise).toBeDefined();
      });
      it("should call any the promise's handler with the arguments to resolveWith()", function() {
        var handler_args, resolved_args, spyF;
        resolved_args = [1, 2, 3];
        handler_args = void 0;
        spyF = jasmine.createSpy();
        promise.then(function() {
          spyF();
          handler_args = Array.prototype.slice.call(arguments[0], 0);
        });
        defer.resolveWith(defer, resolved_args);
        expect(spyF).toHaveBeenCalled();
        return expect(handler_args).toEqual(resolved_args);
      });
    });
  });

  describe("Promise", function() {
    var dfr;
    dfr = void 0;
    beforeEach(function() {
      return dfr = new Greed.Deferred();
    });
    it("should be given from deferred", function() {
      var promise;
      promise = dfr.promise();
      expect(promise.constructor.name).toEqual("Promise");
    });
    it("should execute done and always when deferred is resolved", function() {
      var alwaysSpy, doneSpy, failSpy, promise;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      promise = dfr.promise();
      promise.done(doneSpy).fail(failSpy).always(alwaysSpy);
      dfr.resolve();
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should execute fail and always when deferred is rejected", function() {
      var alwaysSpy, doneSpy, failSpy, promise;
      alwaysSpy = jasmine.createSpy();
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      promise = dfr.promise();
      promise.done(doneSpy).fail(failSpy).always(alwaysSpy);
      dfr.reject();
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
      expect(alwaysSpy).toHaveBeenCalled();
    });
    it("should resolve with context", function() {
      var context, doneSpy, promise;
      doneSpy = jasmine.createSpy();
      context = new Array();
      promise = dfr.promise();
      dfr.resolveWith(context, 1234, "foo");
      promise.done(function(firstArg, secondArg) {
        expect(this).toEqual(context);
        expect(firstArg).toEqual(1234);
        expect(secondArg).toEqual("foo");
        return doneSpy();
      });
      expect(doneSpy).toHaveBeenCalled();
    });
    return it("should reject with context", function() {
      var context, failSpy, promise;
      failSpy = jasmine.createSpy();
      context = new Array();
      promise = dfr.promise();
      dfr.rejectWith(context, 1234, "foo");
      promise.fail(function(firstArg, secondArg) {
        expect(this).toEqual(context);
        expect(firstArg).toEqual(1234);
        expect(secondArg).toEqual("foo");
        return failSpy();
      });
      expect(failSpy).toHaveBeenCalled();
    });
  });

  describe("Deferred.when", function() {
    it("should return a resolved promise object when called without arguments", function() {
      var promise;
      promise = Greed.Deferred.when();
      expect(promise.constructor.name).toEqual("Promise");
      expect(promise.state()).toEqual("resolved");
    });
    it("should return single deferred's promise", function() {
      var dfr, promise;
      dfr = new Greed.Deferred();
      promise = Greed.Deferred.when(dfr);
      expect(promise).toEqual(dfr.promise());
    });
    it("should resolve when all deferreds are resolved", function() {
      var deferreds, doneSpy, promise;
      doneSpy = jasmine.createSpy();
      deferreds = [new Greed.Deferred(), new Greed.Deferred(), new Greed.Deferred()];
      promise = Greed.Deferred.when(deferreds[0], deferreds[1], deferreds[2]);
      promise.done(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        expect(args).toEqual([[1, 2], [3, 4], [5, 6]]);
        doneSpy();
      });
      expect(promise.state()).toEqual("pending");
      deferreds[1].resolve(3, 4);
      expect(promise.state()).toEqual("pending");
      deferreds[0].resolve(1, 2);
      expect(promise.state()).toEqual("pending");
      deferreds[2].resolve(5, 6);
      expect(promise.state()).toEqual("resolved");
      expect(doneSpy).toHaveBeenCalled();
    });
    return it("should reject when first deferred rejects", function() {
      var deferreds, doneSpy, failSpy, promise;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      deferreds = [new Greed.Deferred(), new Greed.Deferred(), new Greed.Deferred()];
      promise = Greed.Deferred.when(deferreds[0], deferreds[1], deferreds[2]);
      promise.fail(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        expect(args).toEqual([1, 2]);
        failSpy();
      });
      promise.done(doneSpy);
      expect(promise.state()).toEqual("pending");
      deferreds[1].resolve(3, 4);
      expect(promise.state()).toEqual("pending");
      deferreds[0].reject(1, 2);
      expect(promise.state()).toEqual("rejected");
      expect(failSpy).toHaveBeenCalled();
      expect(doneSpy).not.toHaveBeenCalled();
    });
  });

  describe("Deferred.pipe", function() {
    var dfr;
    dfr = void 0;
    beforeEach(function() {
      return dfr = new Greed.Deferred();
    });
    it("should fire normally without parameters when resolved", function() {
      var context, doneSpy, failSpy, param;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      context = new Array();
      param = "foo";
      dfr.pipe().done(function(value) {
        expect(value).toEqual(param);
        expect(this).toEqual(context);
        doneSpy();
      }).fail(function(value) {
        failSpy();
      });
      dfr.resolveWith(context, param);
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
    });
    it("should fire normally without parameters when rejected", function() {
      var context, doneSpy, failSpy, param;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      context = new Array();
      param = "foo";
      dfr.pipe().done(function(value) {
        doneSpy();
      }).fail(function(value) {
        expect(value).toEqual(param);
        expect(this).toEqual(context);
        failSpy();
      });
      dfr.rejectWith(context, param);
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
    });
    it("should filter with function (resolve)", function() {
      var context, doneSpy, failSpy, param1, param2;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      param1 = "foo";
      param2 = "bar";
      context = new Array();
      dfr.pipe(function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return string1 + string2;
      }).done(function(value) {
        expect(value).toEqual(param1 + param2);
        expect(this).toEqual(context);
        return doneSpy();
      }).fail(function(value) {
        return failSpy();
      });
      dfr.resolveWith(context, param1, param2);
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
    });
    it("should filter with function (reject)", function() {
      var context, doneSpy, failSpy, param1, param2;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      param1 = "foo";
      param2 = "bar";
      context = new Array();
      dfr.pipe(null, function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return string1 + string2;
      }).done(function(value) {
        return doneSpy();
      }).fail(function(value) {
        expect(value).toEqual(param1 + param2);
        expect(this).toEqual(context);
        return failSpy();
      });
      dfr.rejectWith(context, param1, param2);
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
    });
    it("should filter with another observable (deferred:resolve, pipe:reject)", function() {
      var context, doneSpy, failSpy, param1, param2, pipeDfr;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      param1 = "foo";
      param2 = "bar";
      context = new Array();
      pipeDfr = new Greed.Deferred();
      dfr.pipe(function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return pipeDfr.rejectWith(this, string1, string2).promise();
      }).fail(function(passed1, passed2) {
        expect(passed1).toEqual(param1);
        expect(passed2).toEqual(param2);
        expect(this).toEqual(context);
        return failSpy();
      }).done(doneSpy);
      dfr.resolveWith(context, param1, param2);
      expect(doneSpy).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalled();
    });
    return it("should filter with another observable (deferred:reject, pipe:resolve)", function() {
      var context, doneSpy, failSpy, param1, param2, pipeDfr;
      doneSpy = jasmine.createSpy();
      failSpy = jasmine.createSpy();
      param1 = "foo";
      param2 = "bar";
      context = new Array();
      pipeDfr = new Greed.Deferred();
      dfr.pipe(null, function(string1, string2) {
        expect(string1).toEqual(param1);
        expect(string2).toEqual(param2);
        return pipeDfr.resolveWith(this, string1, string2);
      }).fail(failSpy).done(function(passed1, passed2) {
        expect(passed1).toEqual(param1);
        expect(passed2).toEqual(param2);
        expect(this).toEqual(context);
        return doneSpy();
      });
      dfr.rejectWith(context, param1, param2);
      expect(doneSpy).toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
    });
  });

  describe("Progress and notify", function() {
    var dfr;
    dfr = void 0;
    beforeEach(function() {
      return dfr = new Greed.Deferred();
    });
    it("should notify with correct context", function() {
      var context, param1, param2, progressCalled, progressSpy;
      progressSpy = jasmine.createSpy();
      param1 = "foo";
      param2 = "bar";
      progressCalled = 0;
      context = new Array();
      dfr.progress(function(value1, value2) {
        progressSpy();
        progressCalled++;
        expect(value1).toEqual(param1);
        expect(value2).toEqual(param2);
        expect(this).toEqual(context);
      });
      dfr.notifyWith(context, param1, param2);
      expect(progressSpy).toHaveBeenCalled();
      dfr.notifyWith(context, param1, param2);
      dfr.resolve();
      dfr.notify();
    });
  });

}).call(this);
