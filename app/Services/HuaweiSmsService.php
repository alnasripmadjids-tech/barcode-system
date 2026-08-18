<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class HuaweiSmsService
{
    /**
     * Huawei E303 actual working serial interface.
     */
    private string $port = 'COM3';
    private int $baudRate = 9600;

    /**
     * Open Huawei modem serial port.
     */
    private function openPort()
    {
        exec(
            'mode ' . $this->port .
            ' BAUD=' . $this->baudRate .
            ' PARITY=N DATA=8 STOP=1 XON=OFF'
        );

        return @fopen(
            '\\\\.\\' . $this->port,
            'r+'
        );
    }

    /**
     * Read modem response with timeout.
     */
    private function readResponse($handle, int $timeout = 5): string
    {
        $response = '';
        $start = microtime(true);

        while ((microtime(true) - $start) < $timeout) {

            $data = @fread($handle, 1024);

            if ($data !== false && $data !== '') {
                $response .= $data;

                if (
                    str_contains($response, 'OK') ||
                    str_contains($response, 'ERROR') ||
                    str_contains($response, '+CMS ERROR') ||
                    str_contains($response, '>')
                ) {
                    break;
                }
            }

            usleep(100000);
        }

        return $response;
    }

    /**
     * Send AT command and return response.
     */
    private function sendCommand($handle, string $command, int $timeout = 5): string
    {
        fwrite($handle, $command . "\r");

        return $this->readResponse($handle, $timeout);
    }

    /**
     * Test Huawei modem connection.
     */
    public function testConnection(): array
    {
        $handle = null;

        try {

            $handle = $this->openPort();

            if (!$handle) {
                return [
                    'success' => false,
                    'message' => "Hindi mabuksan ang Huawei modem sa {$this->port}.",
                    'response' => '',
                ];
            }

            stream_set_blocking($handle, false);

            /*
             * Basic modem test.
             */
            $response = $this->sendCommand(
                $handle,
                'AT',
                5
            );

            fclose($handle);
            $handle = null;

            $response = trim($response);

            $success = str_contains($response, 'OK');

            Log::info('Huawei modem connection test', [
                'port' => $this->port,
                'baud_rate' => $this->baudRate,
                'response' => $response,
            ]);

            return [
                'success' => $success,
                'message' => $success
                    ? 'Huawei E303 modem is responding.'
                    : 'Huawei E303 modem did not respond to AT command.',
                'response' => $response,
            ];

        } catch (\Throwable $e) {

            if (is_resource($handle)) {
                fclose($handle);
            }

            Log::error('Huawei modem connection test failed.', [
                'port' => $this->port,
                'baud_rate' => $this->baudRate,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'response' => '',
            ];
        }
    }

    /**
     * Send SMS through Huawei E303.
     */
    public function sendSms(string $phoneNumber, string $message): bool
    {
        $handle = null;

        try {

            $handle = $this->openPort();

            if (!$handle) {
                Log::error('Huawei SMS: Cannot open modem port.', [
                    'port' => $this->port,
                    'baud_rate' => $this->baudRate,
                ]);

                return false;
            }

            stream_set_blocking($handle, false);

            /*
             * Clear any old modem response.
             */
            @fread($handle, 4096);

            /*
             * Basic modem test.
             */
            $response = $this->sendCommand(
                $handle,
                'AT',
                5
            );

            if (!str_contains($response, 'OK')) {

                Log::error('Huawei SMS: Modem did not respond to AT.', [
                    'port' => $this->port,
                    'response' => trim($response),
                ]);

                fclose($handle);

                return false;
            }

            /*
             * Enable verbose errors.
             */
            $response = $this->sendCommand(
                $handle,
                'AT+CMEE=2',
                5
            );

            if (!str_contains($response, 'OK')) {

                Log::warning('Huawei SMS: CMEE command failed.', [
                    'response' => trim($response),
                ]);
            }

            /*
             * SMS text mode.
             */
            $response = $this->sendCommand(
                $handle,
                'AT+CMGF=1',
                5
            );

            if (!str_contains($response, 'OK')) {

                Log::error('Huawei SMS: CMGF command failed.', [
                    'response' => trim($response),
                ]);

                fclose($handle);

                return false;
            }

            /*
             * GSM character set.
             */
            $response = $this->sendCommand(
                $handle,
                'AT+CSCS="GSM"',
                5
            );

            if (!str_contains($response, 'OK')) {

                Log::error('Huawei SMS: CSCS command failed.', [
                    'response' => trim($response),
                ]);

                fclose($handle);

                return false;
            }

            /*
             * SMS parameters confirmed from manual modem test.
             */
            $response = $this->sendCommand(
                $handle,
                'AT+CSMP=17,167,0,0',
                5
            );

            if (!str_contains($response, 'OK')) {

                Log::error('Huawei SMS: CSMP command failed.', [
                    'response' => trim($response),
                ]);

                fclose($handle);

                return false;
            }

            /*
             * Normalize Philippine mobile number.
             *
             * 09274422915
             *       ↓
             * +639274422915
             */
            $phoneNumber = trim($phoneNumber);

            if (str_starts_with($phoneNumber, '09')) {
                $phoneNumber = '+63' . substr($phoneNumber, 1);
            } elseif (str_starts_with($phoneNumber, '63')) {
                $phoneNumber = '+' . $phoneNumber;
            }

            /*
             * Request SMS composition prompt.
             */
            fwrite(
                $handle,
                'AT+CMGS="' . $phoneNumber . '"' . "\r"
            );

            $response = $this->readResponse(
                $handle,
                10
            );

            if (!str_contains($response, '>')) {

                Log::error('Huawei SMS: SMS prompt not received.', [
                    'port' => $this->port,
                    'phone' => $phoneNumber,
                    'response' => trim($response),
                ]);

                fclose($handle);

                return false;
            }

            /*
             * Send SMS body.
             */
            fwrite(
                $handle,
                $message
            );

            /*
             * CTRL+Z = submit SMS.
             */
            fwrite(
                $handle,
                chr(26)
            );

            /*
             * Wait for final modem response.
             */
            $response = $this->readResponse(
                $handle,
                30
            );

            fclose($handle);
            $handle = null;

            $response = trim($response);

            $success =
                str_contains($response, '+CMGS:') &&
                str_contains($response, 'OK');

            Log::info('Huawei SMS response', [
                'port' => $this->port,
                'baud_rate' => $this->baudRate,
                'phone' => $phoneNumber,
                'response' => $response,
                'success' => $success,
            ]);

            return $success;

        } catch (\Throwable $e) {

            if (is_resource($handle)) {
                fclose($handle);
            }

            Log::error('Huawei SMS exception.', [
                'port' => $this->port,
                'phone' => $phoneNumber ?? '',
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

