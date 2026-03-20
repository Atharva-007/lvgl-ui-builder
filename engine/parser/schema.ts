import type { ProjectSchema } from '../../frontend/src/types'

export function assertValidProjectSchema(payload: unknown): ProjectSchema {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Project payload must be an object')
  }

  const cast = payload as ProjectSchema
  if (!cast.screen || typeof cast.screen.width !== 'number' || typeof cast.screen.height !== 'number') {
    throw new Error('Invalid screen configuration')
  }

  if (!Array.isArray(cast.components)) {
    throw new Error('Project components must be an array')
  }

  return cast
}
