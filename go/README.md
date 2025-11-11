# go-hexdump
This is the Go implementation of hexdump. See the [main README](../README.md) for more information about the project.

A Go utility for dumping the bytes of a file or stream in hexadecimal, octal, or binary.

## Requirements

- **Go** >= 1.25.4 

## Usage
**go-hexdump** accepts a path argument representing the file it should read
 from.  By default, the application dumps the data in base 16 (hexadecimal).
 However, flags exist for dumping data in base 2 (binary) and base 8 (octal).

First, build the binary:
```bash
go build -o .bin/hexdump main.go
```

Then run it:
```
.bin/hexdump [-b,-o] <path>

-b
    Show data in binary

-o
    Show data in octal
```

Alternatively, you can run it directly with `go run`:
```
go run main.go [-b,-o] <path>
```

Alternatively, **go-hexdump** can accept a binary stream from stdin:
```
cat <path> | .bin/hexdump [-b,-o]
```

Or with `go run`:
```
cat <path> | go run main.go [-b,-o]
```

## Example output
**Hexadecimal:**
```
$ .bin/hexdump test.gif
00000000: 47 49 46 38 39 61 01 00 01 00 00 00 00 21 f9 04  GIF89a.......!..
00000010: 01 00 00 00 00 2c 00 00 00 00 01 00 01 00 00 02  .....,..........
00000020: 02 04 01 00 3b                                   ....;
```
---
**Octal:**
```
$ .bin/hexdump -o test.gif
00000000: 107 111 106 070 071 141 001 000 001 000 000 000  GIF89a......
0000000c: 000 041 371 004 001 000 000 000 000 054 000 000  .!.......,..
00000018: 000 000 001 000 001 000 000 002 002 004 001 000  ............
00000024: 073                                              ;
```
---
**Binary:**
```
$ .bin/hexdump -b test.gif
00000000: 01000111 01001001 01000110 00111000 00111001 01100001  GIF89a
00000006: 00000001 00000000 00000001 00000000 00000000 00000000  ......
0000000c: 00000000 00100001 11111001 00000100 00000001 00000000  .!....
00000012: 00000000 00000000 00000000 00101100 00000000 00000000  ...,..
00000018: 00000000 00000000 00000001 00000000 00000001 00000000  ......
0000001e: 00000000 00000010 00000010 00000100 00000001 00000000  ......
00000024: 00111011                                               ;
```

