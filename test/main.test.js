import { describe, it, expect } from 'vitest'
import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

const getFileContent = (path) => {
  return readFileSync(join(process.cwd(), path), 'utf-8')
}

const runCommand = (command, args) => {
  const stdin = 'ignore';
  const stdout = 'pipe';
  const stderr = 'pipe';
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: [stdin, stdout, stderr], // ignore stdin, capture stdout and stderr
    encoding: 'utf-8',
  })

  return result.stdout.toString()
}

const runCommandWithStdin = (command, args, stdinInput) => {
  const stdin = 'pipe';
  const stdout = 'pipe';
  const stderr = 'pipe';
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: [stdin, stdout, stderr], // pipe stdin, capture stdout and stderr
    input: stdinInput,
    encoding: 'utf-8',
  })

  return result.stdout.toString()
}

const cases = [
  {
    description: 'PNG file',
    input: 'test/data/input1.png',
    expectedHexOutput: 'test/data/output1-hex.txt',
    expectedOctOutput: 'test/data/output1-oct.txt',
    expectedBinOutput: 'test/data/output1-bin.txt',
  },
  {
    description: 'PDF file',
    input: 'test/data/input2.pdf',
    expectedHexOutput: 'test/data/output2-hex.txt',
    expectedOctOutput: 'test/data/output2-oct.txt',
    expectedBinOutput: 'test/data/output2-bin.txt',
  }
]

describe('Hexdump PHP Tests', () => {
  cases.forEach(({ description, input, expectedHexOutput, expectedOctOutput, expectedBinOutput }) => {
    describe(`${description}`, () => {
      it(`should produce correct hexidecimal (base 16) output`, () => {
        // arrange
        const expectedOutput = getFileContent(expectedHexOutput)
        
        // act
        const stdout = runCommand('php', ['php/hexdump.php', input])
        
        // assert
        expect(stdout).toBe(expectedOutput)
      })
      
      it(`should produce correct octal (base 8) output`, () => {
        // arrange
        const expectedOutput = getFileContent(expectedOctOutput)
        
        // act
        const stdout = runCommand('php', ['php/hexdump.php', '-o', input])
        
        // assert
        expect(stdout).toBe(expectedOutput)
      })

      it(`should produce correct binary (base 2) output`, () => {
        // arrange
        const expectedOutput = getFileContent(expectedBinOutput)
        
        // act
        const stdout = runCommand('php', ['php/hexdump.php', '-b', input])
        
        // assert
        expect(stdout).toBe(expectedOutput)
      })
    })
  })

  describe('piped stdin', () => {
    cases.forEach(({ description, input, expectedHexOutput, expectedOctOutput, expectedBinOutput }) => {
      describe(`${description}`, () => {
        it(`should produce correct hexadecimal (base 16) output from stdin`, () => {
          // arrange
          const inputContent = readFileSync(join(process.cwd(), input), null) // Read as binary
          const expectedOutput = getFileContent(expectedHexOutput)
          
          // act
          const stdout = runCommandWithStdin('php', ['php/hexdump.php'], inputContent)
          
          // assert
          expect(stdout).toBe(expectedOutput)
        })

        it(`should produce correct octal (base 8) output from stdin`, () => {
          // arrange
          const inputContent = readFileSync(join(process.cwd(), input), null) // Read as binary
          const expectedOutput = getFileContent(expectedOctOutput)
          
          // act
          const stdout = runCommandWithStdin('php', ['php/hexdump.php', '-o'], inputContent)
          
          // assert
          expect(stdout).toBe(expectedOutput)
        })

        it(`should produce correct binary (base 2) output from stdin`, () => {
          // arrange
          const inputContent = readFileSync(join(process.cwd(), input), null) // Read as binary
          const expectedOutput = getFileContent(expectedBinOutput)
          
          // act
          const stdout = runCommandWithStdin('php', ['php/hexdump.php', '-b'], inputContent)
          
          // assert
          expect(stdout).toBe(expectedOutput)
        })
      })
    })
  })
})

