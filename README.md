# hexdump

A multi-language implementation of a hexdump utility for dumping the bytes of a file or stream in hexadecimal, octal, or binary format.

## Requirements

- **PHP** >= 8.4.5
- **Go** >= 1.25.4
- **Node.js** >= 22.21.1 (for running tests)
- **npm** >= 10.9.4 (for running tests)

## Implementations

This repository contains implementations in multiple programming languages:

- **[PHP](php/)** - PHP implementation
- **[Go](go/)** - Go implementation

## Features

All implementations support:
- Hexadecimal output (default)
- Octal output (`-o` flag)
- Binary output (`-b` flag)
- Reading from file or piped stdin

## Testing

The project includes a comprehensive test suite using [Vitest](https://vitest.dev/) that validates all implementations against expected outputs.

### Test Coverage

The test suite verifies:
- **Output formats**: Hexadecimal (base 16), octal (base 8), and binary (base 2) for all implementations
- **Input methods**: Both file path arguments and piped stdin
- **Test files**: PNG and GIF binary files
- **Error handling**: Proper exit behavior when no input is provided

### Running Tests

First, install dependencies:
```bash
npm ci
```

Then run the tests:
```bash
npm test
```

### Latest Test Results

```
✓ test/main.test.js (26 tests) 3309ms
  ✓ PHP Implementation
    ✓ PNG file
      ✓ should produce correct hexidecimal (base 16) output
      ✓ should produce correct octal (base 8) output
      ✓ should produce correct binary (base 2) output
    ✓ GIF file
      ✓ should produce correct hexidecimal (base 16) output
      ✓ should produce correct octal (base 8) output
      ✓ should produce correct binary (base 2) output
    ✓ piped stdin
      ✓ PNG file
        ✓ should produce correct hexadecimal (base 16) output from stdin
        ✓ should produce correct octal (base 8) output from stdin
        ✓ should produce correct binary (base 2) output from stdin
      ✓ GIF file
        ✓ should produce correct hexadecimal (base 16) output from stdin
        ✓ should produce correct octal (base 8) output from stdin
        ✓ should produce correct binary (base 2) output from stdin
    ✓ no input provided
      ✓ should exit immediately when no file path and no stdin is provided
  ✓ Go Implementation
    ✓ PNG file
      ✓ should produce correct hexidecimal (base 16) output
      ✓ should produce correct octal (base 8) output
      ✓ should produce correct binary (base 2) output
    ✓ GIF file
      ✓ should produce correct hexidecimal (base 16) output
      ✓ should produce correct octal (base 8) output
      ✓ should produce correct binary (base 2) output
    ✓ piped stdin
      ✓ PNG file
        ✓ should produce correct hexadecimal (base 16) output from stdin
        ✓ should produce correct octal (base 8) output from stdin
        ✓ should produce correct binary (base 2) output from stdin
      ✓ GIF file
        ✓ should produce correct hexadecimal (base 16) output from stdin
        ✓ should produce correct octal (base 8) output from stdin
        ✓ should produce correct binary (base 2) output from stdin
    ✓ no input provided
      ✓ should exit immediately when no file path and no stdin is provided

Test Files  1 passed (1)
     Tests  26 passed (26)
  Duration  3.41s
```

## License

See [LICENSE](LICENSE) for details.

