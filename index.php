<?php

$root = dirname($_SERVER['DOCUMENT_ROOT']);

$socket = stream_socket_client("unix://{$root}/socket/render.sock", $errno);

if ($errno === 0) {
  $data = [
    'folder' => $root . '/www/kaliberjs/includes/' . $component,
    'component' => $component,
    'props' => $props
  ];

  fwrite($socket, json_encode($data));
  echo fread($socket, 4096);
  fclose($socket);
} else {
  dump('render static markup');
}
