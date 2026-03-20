import { promises as fs } from 'node:fs'

export async function saveProject(filePath, projectJson) {
  await fs.writeFile(filePath, projectJson, 'utf8')
}

export async function loadProject(filePath) {
  return fs.readFile(filePath, 'utf8')
}
