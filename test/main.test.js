import { describe, it, expect } from 'vitest'
import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

const getFileContent = (path) => {
  return readFileSync(join(process.cwd(), path), 'utf-8')
}

const runCommand = (command, args, options) => {
  const result = spawnSync(command, args, {
    ...options,
    stdio: ['ignore', 'pipe', 'pipe'], // ignore stdin, capture stdout and stderr
    encoding: 'utf-8',
  })

  return result.stdout
}

describe('Hexdump PHP Tests', () => {
  it('should produce correct hexdump output for test.png', () => {
    // arrange
    const phpDir = join(process.cwd(), 'php')
    const expectedOutput = getFileContent('test/data/output1-bin.txt')
    
    // act
    const stdout = runCommand('php', ['hexdump.php', 'test.png'], {
      cwd: phpDir,
    })
    
    // assert
    expect(stdout).toBe(expectedOutput)
  })
})

