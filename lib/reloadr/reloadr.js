window.addEventListener('load', function(){

  if(reloadr.notifications) {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }

  reloadr['reload'] = function () {
    location.reload();
  }
  var source = new EventSource(reloadr.reloadSource);
  source.addEventListener('message', function(e){
    var message = JSON.parse(e.data);
    if(message.reloadr) {
      if(reloadr.notifications) {
        var n = new Notification('Reloadr', {body: location.href.split('//')[1] + ' has reloaded'});
      }
      reloadr[message.reloadr.method]();
    } else {
      console.log(message);
    }
  }, false)
}, false);