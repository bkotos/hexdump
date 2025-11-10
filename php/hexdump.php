<?php

define('BINARY_FLAG', '-b');
define('OCTAL_FLAG', '-o');

/**
 * @param string[] $arguments
 */
function main(array &$arguments)
{
    $isBin = argumentFlagExists(BINARY_FLAG, $arguments);
    $isOct = argumentFlagExists(OCTAL_FLAG, $arguments);

    if ($isBin) {
        // binary
        $bytesPerLine = 6;
        $colsPerByte = 9;
    } else if ($isOct) {
        // octal
        $bytesPerLine = 12;
        $colsPerByte = 4;
    } else {
        // hexadecimal
        $bytesPerLine = 16;
        $colsPerByte = 3;
    }

    list($command, $filename) = array_pad($arguments, 2, null);
    
    // If no filename is provided, use stdin
    // Otherwise, use the file (not stdin)
    $hasStdIn = ($filename === null);
    
    $file = getFile($hasStdIn, $filename);

    if (!$file) {
        exit(0);
    }

    exitIfNoInput($hasStdIn);

    $bytes = [];
    $chars = '';
    $byteOffset = 0; // Track byte position manually for both stdin and files

    // For files, initialize offset from current position
    if (!$hasStdIn) {
        $byteOffset = ftell($file);
    }

    for($i = 0; !feof($file); $i++) {
        $isNewLine = ($i + 1) % $bytesPerLine === 0;
        $isFirstByteOfLine = $i % $bytesPerLine === 0;

        if ($isFirstByteOfLine) {
            $line = str_pad(dechex($byteOffset), 8, '0', STR_PAD_LEFT);
        }

        $char = fread($file, 1);
        if ($char === false || $char === '') {
            break;
        }
        $ascii = ord($char);
        $byteOffset++; // Increment offset after reading (consistent for both)
        $chars .= getPrintableChar($char);
        if ($isBin) {
            $bytes[] = asciiToBin($ascii);
        } elseif ($isOct) {
            $bytes[] = asciiToOct($ascii);
        } else {
            $bytes[] = asciiToHex($ascii);
        }

        if ($isNewLine) {
            echo renderDump($bytesPerLine, $colsPerByte, $line, $bytes, $chars);
        }
    }

    if (count($bytes) > 0) {
        echo renderDump($bytesPerLine, $colsPerByte, $line, $bytes, $chars);
    }

    fclose($file);
}

/**
 * @param string $argumentFlag
 * @param string[] $arguments
 * @return bool
 */
function argumentFlagExists(string $argumentFlag, array &$arguments): bool
{
    $index = array_search($argumentFlag, $arguments);

    if ($index !== false) {
        array_splice($arguments, $index, 1);

        return true;
    }

    return false;
}

/**
 * @param bool $hasStdIn
 * @param string|null $filename
 * @return resource|bool|null
 */
function getFile(bool $hasStdIn, ?string $filename = null)
{
    if ($hasStdIn) {
        return STDIN;
    } elseif($filename !== null && file_exists($filename)) {
        return fopen($filename, 'r');
    }

    return null;
}

/**
 * @param int $bytesPerLine
 * @param int $colsPerByte
 * @param string $line
 * @param string[] $bytes
 * @param string $chars
 * @return string
 */
function renderDump(int $bytesPerLine, int $colsPerByte, string $line, array &$bytes, string &$chars): string
{
    $byteDump = str_pad(implode(' ', $bytes), $bytesPerLine * $colsPerByte);

    $dump = "$line: $byteDump $chars" . PHP_EOL;
    $bytes = [];
    $chars = '';

    return $dump;
}

/**
 * @param string $char
 * @return string
 */
function getPrintableChar(string $char): string
{
    $ascii = ord($char);
    $printableAscii = 46;

    if ($ascii >= 32 && $ascii <= 126) {
        $printableAscii = $ascii;
    }

    return chr($printableAscii);
}

/**
 * @param int $ascii
 * @return string
 */
function asciiToBin(int $ascii): string
{
    return str_pad(decbin($ascii), 8, '0', STR_PAD_LEFT);
}

/**
 * @param int $ascii
 * @return string
 */
function asciiToHex(int $ascii): string
{
    return str_pad(dechex($ascii), 2, '0', STR_PAD_LEFT);
}

/**
 * @param int $ascii
 * @return string
 */
function asciiToOct(int $ascii): string
{
    return str_pad(decoct($ascii), 3, '0', STR_PAD_LEFT);
}

/**
 * @param bool $hasStdIn
 */
function exitIfNoInput(bool $hasStdIn)
{
    if ($hasStdIn && function_exists('stream_isatty') && stream_isatty(STDIN)) {
        $read = [STDIN];
        $write = null;
        $except = null;
        if (stream_select($read, $write, $except, 0) === 0) {
            exit(0);
        }
    }
}

main($argv);
