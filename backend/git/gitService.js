import { execFile } from 'node:child_process'

export function gitStatus(cwd) {
  return new Promise((resolve, reject) => {
    execFile('git', ['status', '--short'], { cwd }, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout.trim())
    })
  })
}
