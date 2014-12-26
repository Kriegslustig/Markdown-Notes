<?php

require 'reloadr.class.php';
require 'event_stream.class.php';

$event_stream = new Event_stream;
$event_stream->set_headers();

$reload_callback = function () {
  $msg = [
    'reloadr' => [
      'method' => 'reload'
    ]
  ];
  Event_stream::send_event($msg);
};
$reloadr = new Reloadr($reload_callback);

if(!empty($_GET['watch_dir'])) {
  $reloadr->set_dir(urldecode($_GET['watch_dir']));
}

if (!empty($_GET['ignore'])) {
  $reloadr->set_ignores(urldecode($_GET['ignore']));
}

$reloadr->set_listener();