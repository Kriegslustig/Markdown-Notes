var createMarkElement = (function () {
  var _node,
  _cover,
  _markSyntax = [],
  _viewMode = false;

  function _checkSyntax () {
    var content = _node.value;
    _markSyntax.forEach(function (val, index, array) {
      var match = true;

      while (match){
        if(_viewMode && val.view) {
          newContent = content.replace(val.regex, val.view);
        } else {
          newContent = content.replace(val.regex, val.tag);
        }
        if(newContent === content) {
          break;
        } else {
          content = newContent;
        }
      };
    });
    _cover.innerHTML = content;
  }

  function _setListeners () {
    document.addEventListener('keydown', function () {
      setTimeout( function () {
        _checkSyntax();
      }, 20);
    }, false);
    window.addEventListener('hashchange', function () {
      setTimeout( function () {
        _checkSyntax();
      }, 20);
    }, false)
  }

  return {
    init: function (node) {
      _node = node;
      _cover = document.querySelector('.markdown__cover');
      _checkSyntax();
      _setListeners();
    },
    addSyntax: function (pushThis) {
      if(Array.isArray(pushThis)) {
        _markSyntax = _markSyntax.concat(pushThis);
      } else {
        _markSyntax.push(pushThis);
      }
    },
    toggleViewMode: function () {
      _viewMode = !_viewMode;
      _checkSyntax();
      console.log('viewmode ' + _viewMode);
      return _viewMode;
    }
  }
});