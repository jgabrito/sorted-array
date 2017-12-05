(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.SortedArray = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  var SortedArray = (function () {
    var SortedArray = defclass({
      constructor: function (array, compare) {
        this.array   = [];
        this.compare = compare || compareDefault;
        var length   = array.length;
        var index    = 0;

        while (index < length) this.insert(array[index++]);
      },
      insert: function (element) {
        var array   = this.array;
        var compare = this.compare;
        var index   = array.length;

        array.push(element);

        while (index > 0) {
          var i = index, j = --index;

          if (compare(array[i], array[j]) < 0) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
        }

        return this;
      },
      search: function (element) {
        var array   = this.array;
        var compare = this.compare;
        var high    = array.length;
        var low     = 0;

        while (high > low) {
          var index    = (high + low) / 2 >>> 0;
          var ordering = compare(array[index], element);

          if (ordering < 0) low  = index + 1;
          else if (ordering > 0) high = index;
          else return index;
        }

        return -1;
      },
      remove: function (element) {
        var index = this.search(element);
        if (index >= 0) this.array.splice(index, 1);
        return this;
      }
    });

    SortedArray.comparing = function (property, array) {
      return new SortedArray(array, function (a, b) {
        return compareDefault(property(a), property(b));
      });
    };

    return SortedArray;

    function defclass(prototype) {
      var constructor = prototype.constructor;
      constructor.prototype = prototype;
      return constructor;
    }

    function compareDefault(a, b) {
      if (a === b) return 0;
      return a < b ? -1 : 1;
    }
  }());

  return SortedArray;
}));
