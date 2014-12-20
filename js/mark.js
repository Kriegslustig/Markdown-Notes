window.addEventListener('load', function () {

  var markElem = createMarkElement();
  markElem.init(document.querySelector('.markdown__textarea'));
  document.querySelector('.markdown__textarea').focus();

}, false);

var createMarkElement = (function () {
  var _markSyntax = [
    {
      description: 'Header 1 text',
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
      description: 'Code block',
      regex: /(^|\ )`{3}\n([^$]*)\n`{3}/gm,
      tag: function ($0,$1,$2) {
        return $1 + '&#0096;&#0096;&#0096;\n<code class="code_block">' + $2 + '</code>\n&#0096;&#0096;&#0096;';
      }
    },
    {
      description: 'Inline code',
      regex: /(^|\ )`{3}([^$]*)`{3}/gm,
      tag: function ($0,$1,$2) {
        return $1 + '&#0096;&#0096;&#0096;<code>' + $2 + '</code>&#0096;&#0096;&#0096;';
      }
    },
    {
      description: 'Spaces after linebreaks',
      regex: /^\ /gm,
      tag: '&nbsp;'
    },
    {
      description: 'Linebreaks',
      regex: /\n/gm,
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