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

describe('Hexdump PHP Tests', () => {
  it('should produce correct hexdump output for test.png', () => {
    // arrange
    const expectedOutput = getFileContent('test/data/output1-bin.txt')
    
    // act
    const stdout = runCommand('php', ['php/hexdump.php', 'test/data/input1.png'])
    
    // assert
    expect(stdout).toBe(expectedOutput)
  })
})

