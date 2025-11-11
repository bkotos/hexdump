import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  getFileContent,
  runCommand,
  runCommandWithStdin,
  runCommandWithSimulatedTty,
  exitOrTimeoutRace,
  compileGo
} from './utils.js'

const implementations = [
  {
    description: 'PHP',
    command: 'php',
    baseArgs: ['php/hexdump.php']
  },
  {
    description: 'Go',
    command: 'go/.bin/hexdump',
    baseArgs: []
  }
]

const cases = [
  {
    description: 'PNG file',
    input: 'test/data/input1.png',
    expectedHexOutput: 'test/data/output1-hex.txt',
    expectedOctOutput: 'test/data/output1-oct.txt',
    expectedBinOutput: 'test/data/output1-bin.txt',
  },
  {
    description: 'GIF file',
    input: 'test/data/input2.gif',
    expectedHexOutput: 'test/data/output2-hex.txt',
    expectedOctOutput: 'test/data/output2-oct.txt',
    expectedBinOutput: 'test/data/output2-bin.txt',
  }
]

describe('Hexdump', () => {
  beforeAll(() => {
    compileGo()
  })

  implementations.forEach(({ description, command, baseArgs }) => {
    describe(`${description} Implementation`, () => {
      cases.forEach(({ description, input, expectedHexOutput, expectedOctOutput, expectedBinOutput }) => {
        describe(`${description}`, () => {
          it(`should produce correct hexidecimal (base 16) output when no CLI flag is specified`, () => {
            // arrange
            const expectedOutput = getFileContent(expectedHexOutput)
            
            // act
            const stdout = runCommand(command, [...baseArgs, input])
            
            // assert
            expect(stdout).toBe(expectedOutput)
          })

          it(`should produce correct hexidecimal (base 16) output`, () => {
            // arrange
            const expectedOutput = getFileContent(expectedHexOutput)
            
            // act
            const stdout = runCommand(command, [...baseArgs, '-x', input])
            
            // assert
            expect(stdout).toBe(expectedOutput)
          })
          
          it(`should produce correct octal (base 8) output`, () => {
            // arrange
            const expectedOutput = getFileContent(expectedOctOutput)
            
            // act
            const stdout = runCommand(command, [...baseArgs, '-o', input])
            
            // assert
            expect(stdout).toBe(expectedOutput)
          })
    
          it(`should produce correct binary (base 2) output`, () => {
            // arrange
            const expectedOutput = getFileContent(expectedBinOutput)
            
            // act
            const stdout = runCommand(command, [...baseArgs, '-b', input])
            
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
              const stdout = runCommandWithStdin(command, [...baseArgs], inputContent)
              
              // assert
              expect(stdout).toBe(expectedOutput)
            })
    
            it(`should produce correct octal (base 8) output from stdin`, () => {
              // arrange
              const inputContent = readFileSync(join(process.cwd(), input), null) // Read as binary
              const expectedOutput = getFileContent(expectedOctOutput)
              
              // act
              const stdout = runCommandWithStdin(command, [...baseArgs, '-o'], inputContent)
              
              // assert
              expect(stdout).toBe(expectedOutput)
            })
    
            it(`should produce correct binary (base 2) output from stdin`, () => {
              // arrange
              const inputContent = readFileSync(join(process.cwd(), input), null) // Read as binary
              const expectedOutput = getFileContent(expectedBinOutput)
              
              // act
              const stdout = runCommandWithStdin(command, [...baseArgs, '-b'], inputContent)
              
              // assert
              expect(stdout).toBe(expectedOutput)
            })
          })
        })
      })
    
      describe('no input provided', () => {
        it('should exit immediately when no file path and no stdin is provided', async () => {
          // arrange
          const process = runCommandWithSimulatedTty(command, [...baseArgs])
          
          // act
          const result = await exitOrTimeoutRace(process)
    
          // assert
          expect(result.timedOut).toBe(false)
        })
      })
    })
  })
})
