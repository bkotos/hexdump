import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

export const getFileContent = (path) => {
  return readFileSync(join(process.cwd(), path), 'utf-8')
}

export const runCommand = (command, args) => {
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

export const runCommandWithStdin = (command, args, stdinInput) => {
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

export const exitOrTimeoutRace = async (ptyProcess) => {
  const exitPromise = new Promise((resolve) => {
    ptyProcess.onExit(() => {
      resolve({ timedOut: false })
    })
  })

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      ptyProcess.kill()
      resolve({ timedOut: true })
    }, 1000)
  })

  return await Promise.race([exitPromise, timeoutPromise])
}

export const compileGo = () => {
  runCommand('go', ['build', '-o', 'go/.bin/hexdump', 'go/main.go'])
}
