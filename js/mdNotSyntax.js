for (var i = 1; i < 6; i++) {
  markElem.addSyntax({
    description: 'Header ' + i + ' text',
    regex: new RegExp('^(#{' + i + '}\ ([^\n$]*))(\n|$)', 'gm'),
    tag: function ($0, $1) {
      return '<h' + i + '>' + $1 + '</h' + i + '>';
    }
  });
};

markElem.addSyntax([
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
    description: 'Images',
    regex: /(^|\ )(\!\[[^\n$]*\]\(([^\n$\ \)]*)\))/gm,
    tag: function ($0, $1, $2, $3) {
      return $1 + '<i>' + $2 + '</i>';
    }
  },
  {
    description: 'Links',
    regex: /(^|\ )(\[[^\n$]*\]\(([^\n$\ \)]*)\))/gm,
    tag: function ($0, $1, $2, $3) {
      return $1 + '<a href="' + $3 + '">' + $2 + '</a>';
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
]);