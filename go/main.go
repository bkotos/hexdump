package main

import (
	"fmt"
	"os"
)

func main() {
	// fmt.Println("Hello, World!")

	data, _ := os.ReadFile("test/data/input1.png")
	// fmt.Println(string(data))

	// line := ""
	for _, b := range data {
		// fmt.Printf("00000000: Byte %d: %d (char: %c)\n", i, b, b)
		// line := line + "00000000: [" + string(b) + "]"
		// fmt.Print(line)
		// fmt.Print(string(b))

		printable := string(byte(46))
		if b >= 32 && b <= 126 {
			printable = string(b)
		}

		fmt.Print(printable)

		// fmt.Printf("00000000: %x (char: %c)\n", b, b)
		// break
	}
}
