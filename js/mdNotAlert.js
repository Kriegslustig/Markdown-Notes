var createAlert = (function (parameters) {
  var _alertTemplate,
  _container = document.querySelector('.markdown'),
  _message,
  _button;

  _create();

  function _create () {
    _message = document.createElement('text');
    _message.className = 'alert__message';
    _message.innerHTML = (parameters.message ? parameters.message : 'Warning');

    _button = document.createElement('button');
    _button.className = 'alert__button';
    _button.innerHTML = (parameters.button ? parameters.button : 'Close');

    _alertTemplate = document.createElement('aside');
    _alertTemplate.className = 'markdown__alert alert';
    _alertTemplate.appendChild(_message);
    _alertTemplate.appendChild(_button);

    _container.appendChild(_alertTemplate);

    _button.addEventListener('click', function () {
      _close();
    }, false);

    if(parameters.time) {
      setTimeout(function () {
        _close();
      }, parameters.time);
    }
  }

  function _open () {
    _container.appendChild();
  }

  function _close () {
    _alertTemplate.remove();
  }

  return {
    close: function () {
      _close();
    },
    open: function () {
      _open();
    },
  }
});