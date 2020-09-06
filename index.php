<?php

$data = [
  'message' => 'ping'
];

$socket = stream_socket_client('unix://socket/render.sock');

echo "send ";
var_dump(json_encode($data));
$written = fwrite($socket, json_encode($data));

echo "<br> revived";
var_dump(fread($socket, 4096));
fclose($socket);
