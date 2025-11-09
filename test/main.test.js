import { describe, it, expect } from 'vitest'
import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

const getFileContent = (path) => {
  return readFileSync(join(process.cwd(), path), 'utf-8')
}

const runCommand = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'], // ignore stdin, capture stdout and stderr
    encoding: 'utf-8',
  })

  return result.stdout
}

const cases = [
  {
    description: 'PNG file',
    input: 'test/data/input1.png',
    expectedHexOutput: 'test/data/output1-hex.txt',
    expectedOctOutput: 'test/data/output1-oct.txt',
  },
  {
    description: 'PDF file',
    input: 'test/data/input2.pdf',
    expectedHexOutput: 'test/data/output2-hex.txt',
    expectedOctOutput: 'test/data/output2-oct.txt',
  }
]

describe('Hexdump PHP Tests', () => {
  cases.forEach(({ description, input, expectedHexOutput, expectedOctOutput }) => {
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
    })
  })
})

