package main

import (
	"fmt"
	"os"
	"strings"
)

func hasFlag(flag string) bool {
	for _, arg := range os.Args[1:] {
		if arg == flag {
			return true
		}

	}
	return false
}

func getSpacing() (bytesPerLine int, colsPerByte int) {
	bytesPerLine = 16
	colsPerByte = 3
	if hasFlag("-b") {
		bytesPerLine = 6
		colsPerByte = 9
	} else if hasFlag("-o") {
		bytesPerLine = 12
		colsPerByte = 4
	}

	return
}

func getFileName() string {
	for _, arg := range os.Args[1:] {
		isFlag := string(arg[0]) == "-"
		if !isFlag {
			return arg
		}

	}
	return ""
}

func main() {
	if len(os.Args) < 2 {
		os.Exit(0)
	}
	fileName := getFileName()

	data, _ := os.ReadFile(fileName)

	var bytes []string
	chars := ""
	bytesPerLine, colsPerByte := getSpacing()

	byteOffset := 0
	line := ""
	for i, b := range data {
		isFirstByteOfLine := i%bytesPerLine == 0
		if isFirstByteOfLine {
			line = fmt.Sprintf("%08x", byteOffset)
		}

		bytes = append(bytes, renderByte(b))
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

func renderByte(b byte) string {
	if hasFlag("-b") {
		return fmt.Sprintf("%08b", b)
	} else if hasFlag("-o") {
		return fmt.Sprintf("%03o", b)
	}
	return fmt.Sprintf("%02x", b)
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
