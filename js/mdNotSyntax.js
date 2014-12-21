markElem.addSyntax([
  {
    description: 'Header 1 text',
    regex: /^(#\ ([^\n$]*))/gm,
    tag: function ($0, $1) {
      return '<b>' + $1 + '</b>';
    }
  },
  {
    description: 'Bold text',
    regex: /(^|\ )(\*\*[^\n\*$]*\*\*)/gm,
    tag: function ($0, $1, $2) {
      return $1 + '<b>' + $2 + '</b>';
    }
  },
  {
    description: 'Italic text',
    regex: /(^|\ )(\*[^\n\*$]*\*)/gm,
    tag: function ($0, $1, $2) {
      return $1 + '<i>' + $2 + '</i>';
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
])