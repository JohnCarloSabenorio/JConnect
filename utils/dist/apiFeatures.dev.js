"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var APIFeatures =
/*#__PURE__*/
function () {
  function APIFeatures(query, queryString) {
    _classCallCheck(this, APIFeatures);

    this.query = query;
    this.queryString = queryString;
  } // METHODS


  _createClass(APIFeatures, [{
    key: "filter",
    value: function filter() {
      try {
        console.log("Query String:", this.queryString); // 1. Converts query string into an object

        var queryObj = _objectSpread({}, this.queryString); // 2. Exclude fields that are used for the api features


        var excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(function (field) {
          return delete queryObj[field];
        }); // 3. Add $ to gte, gt, lte, and lt in the queries

        var queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, function (match) {
          return "$".concat(match);
        }); // 4. Convert the queryString into an object and execute the query

        this.query.find(JSON.parse(queryStr));
      } catch (err) {
        console.log("Failed to filter query!");
        console.log("Error: ".concat(err));
      }

      return this;
    }
  }, {
    key: "sort",
    value: function sort() {
      try {
        if (this.queryString.sort) {
          var sortBy = this.queryString.sort.replace(",", " ");
          this.query.sort(sortBy);
        } else {
          this.query.sort("fname");
        }
      } catch (err) {
        console.log("Failed to sort query!");
        console.log("Error: ".concat(err));
      }

      return this;
    }
  }, {
    key: "limitFields",
    value: function limitFields() {
      try {
        if (this.queryString.fields) {
          var selected = this.queryString.fields.replace(",", " ");
          this.query.select(selected);
        } else {
          this.query.select("-__v");
        }
      } catch (err) {
        console.log("Failed to limit the fields of the query!");
        console.log("Error: ".concat(err));
      }

      return this;
    }
  }, {
    key: "paginate",
    value: function paginate() {}
  }]);

  return APIFeatures;
}();

module.exports = APIFeatures;