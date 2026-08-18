<?php

$port = 'COM5';
$baudRate = 115200;

$phone = '09274422915';
$message = 'Test SMS mula sa SCT Barcode System.';

exec(
    'mode ' . $port .
    ' BAUD=' . $baudRate .
    ' PARITY=N DATA=8 STOP=1 xon=off'
);

$handle = @fopen('\\\\.\\' . $port, 'r+');

if (!$handle) {
    die("Hindi mabuksan ang {$port}." . PHP_EOL);
}

stream_set_blocking($handle, false);

// SMS text mode
fwrite($handle, "AT+CMGF=1\r");
sleep(1);
stream_get_contents($handle);

// Set recipient
fwrite($handle, 'AT+CMGS="' . $phone . '"' . "\r");
sleep(2);

// Send message
fwrite($handle, $message);

// Ctrl+Z = send SMS
fwrite($handle, chr(26));

sleep(5);

$response = stream_get_contents($handle);

fclose($handle);

echo "Modem response:" . PHP_EOL;
echo $response . PHP_EOL;