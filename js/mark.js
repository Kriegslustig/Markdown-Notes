window.addEventListener('load', function () {

  var markElem = createMarkElement();
  markElem.init(document.querySelector('.markdown__textarea'));

}, false);

var createMarkElement = (function () {
  var _markSyntax = [
    {
      description: 'Bold text',
      regex: /^(#\ ([^\n$]*))/gm,
      tag: function ($0, $1) {
        return '<b>' + $1 + '</b>';
      }
    },
    {
      description: 'Italic text',
      regex: /\ (\*[^\n\*$]*\*)/g,
      tag: function ($0, $1) {
        return ' <i>' + $1 + '</i>';
      }
    },
    {
      description: 'Code blocks',
      regex: /(^|\ )```([^$]{0,100})```/gm,
      tag: function ($0,$1,$2) {
        return $1 + '```<code>' + $2 + '</code>```';
      }
    },
    {
      description: 'Spaces after linebreaks',
      regex: /^\ /gm,
      tag: '&nbsp;'
    },
    {
      description: 'Linebreaks',
      regex: /\n/g,
      tag: '<br>'
    },
    {
      description: 'Double spaces',
      regex: /\ (?=\ )/g,
      tag: '&nbsp;'
    },
  ],
  _node,
  _cover;

  function _checkSyntax () {
    var content = _node.value;
    _markSyntax.forEach(function (val, index, array) {
      var match = true;

      while ( match ){
        newContent = content.replace(val.regex, val.tag);
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
  }

  return {
    init: function (node) {
      _node = node;
      _cover = document.querySelector('.markdown__cover');
      _checkSyntax();
      _setListeners();
    },
  }
});