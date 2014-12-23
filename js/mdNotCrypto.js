var createMdNotCrypto = (function () {

  function _password(password, callback) {
    password = (password ? password : '');
    if(!password) {
      passPhrase = localStorage.getItem('passPhrase');
      if(!passPhrase) {
        _createRandomString(function (randomString) {
          localStorage.setItem('passPhrase', randomString);
          callback(randomString);
        }, 50);
      } else {
        callback(passPhrase);
      }
    } else {
      callback(passPhrase);
    }
  }

  function _createRandomString (callback, length) {
    var randomBase64String = '',
    checkReadyness;

    checkReadyness = setInterval(function () {
      console.log(length);
      if(sjcl.random.isReady(10)) {
        while(randomBase64String.length < length) {
          randomInt = sjcl.random.randomWords(1, 10)[0];
          randomBase64String += btoa(randomInt);
        }
        randomBase64String = randomBase64String.substr(0, length);
        callback(randomBase64String);
        clearInterval(checkReadyness);
      }
    }, 1);
  }

  return {
    encrypt: function (password, string, callback) {
      _password(password, function (password) {
        callback( sjcl.encrypt(password, string) );
      });
    },

    decrypt: function (password, string, callback) {
      _password(password, function (password) {
        callback( sjcl.decrypt(password, string) );
      });
    },
    isEncrypted: function (string) {
      try {
        var jsonString = JSON.parse(string);
        if(jsonString && jsonString['cipher'] && jsonString['cipher'] === 'aes') {
          return true;
        }
        return false;
      }
      catch (e) {
        console.log(e);
      }
    }
  }
});

var mdNotCrypto = createMdNotCrypto();