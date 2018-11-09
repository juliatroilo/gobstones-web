"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SolutionsLoader = function (_TextLoader) {
  _inherits(SolutionsLoader, _TextLoader);

  function SolutionsLoader() {
    _classCallCheck(this, SolutionsLoader);

    var _this = _possibleConstructorReturn(this, (SolutionsLoader.__proto__ || Object.getPrototypeOf(SolutionsLoader)).call(this));

    _this.REGEXP = /assets\/solutions\/Solution(\d+)\.(gbs|gbk)/;
    return _this;
  }

  _createClass(SolutionsLoader, [{
    key: "getFiles",
    value: function getFiles(context) {
      var editor = context.editor;
      var files = editor.availableSolutions.slice(1).map(function (solution, i) {
        return {
          name: "assets/solutions/Solution" + (i + 1) + ".gbs",
          content: solution.code.main
        };
      }).concat(editor.availableSolutions.slice(1).map(function (solution, i) {
        return {
          name: "assets/solutions/Solution" + (i + 1) + ".gbk",
          content: solution.workspace.main
        };
      }));

      return files;
    }
  }, {
    key: "readContent",
    value: function readContent(context, content, fileName) {
      var resource = this._isBlocks(fileName) ? "workspace" : "code";
      var index = parseInt(fileName.match(this.REGEXP)[1]);

      context.editor.availableSolutions[index][resource].main = content;
    }
  }, {
    key: "readProjectContent",
    value: function readProjectContent(context, content, fileName) {
      this.readContent(context, content, fileName);
    }
  }, {
    key: "shouldHandle",
    value: function shouldHandle(path) {
      return this.REGEXP.test(path);
    }
  }, {
    key: "_isCode",
    value: function _isCode(path) {
      return _.endsWith(path, ".gbs");
    }
  }, {
    key: "_isBlocks",
    value: function _isBlocks(path) {
      return _.endsWith(path, ".gbk");
    }
  }]);

  return SolutionsLoader;
}(TextLoader);

;