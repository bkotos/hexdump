package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	data, _ := os.ReadFile("test/data/input1.png")

	var bytes []string
	chars := ""

	bytesPerLine := 16
	colsPerByte := 3

	byteOffset := 0
	line := ""
	for i, b := range data {
		isFirstByteOfLine := i%bytesPerLine == 0
		if isFirstByteOfLine {
			line = fmt.Sprintf("%08x", byteOffset)
		}

		bytes = append(bytes, fmt.Sprintf("%02x", b))
		chars = chars + getPrintableChar(b)

		isNewLine := (i+1)%bytesPerLine == 0
		if isNewLine {
			fmt.Print(renderDump(bytesPerLine, colsPerByte, line, &bytes, &chars))
			line = ""
		}

		byteOffset++
	}

	if len(bytes) > 0 {
		fmt.Print(renderDump(bytesPerLine, colsPerByte, line, &bytes, &chars))
	}
}

func renderDump(bytesPerLine int, colsPerByte int, line string, bytes *[]string, chars *string) string {
	x := strings.Join(*bytes, " ")
	width := bytesPerLine * colsPerByte
	byteDump := fmt.Sprintf("%-*s", width, x)

	dump := line + ": " + byteDump + " " + *chars + "\n"
	*bytes = []string{}
	*chars = ""

	return dump
}

func getPrintableChar(b byte) string {
	printable := string(byte(46))
	if b >= 32 && b <= 126 {
		printable = string(b)
	}
	return printable
}
