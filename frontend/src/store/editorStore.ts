import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { snapPoint, snapToGrid } from '../../../engine/layout/snap'
import { assertValidProjectSchema } from '../../../engine/parser/schema'
import type { ComponentType, ProjectSchema, UIComponent } from '../types'

const defaultProject: ProjectSchema = {
  screen: {
    width: 320,
    height: 240,
  },
  components: [],
}

interface EditorState {
  project: ProjectSchema
  selectedId: string | null
  history: ProjectSchema[]
  future: ProjectSchema[]
  addComponent: (type: ComponentType, x?: number, y?: number) => void
  updateComponent: (id: string, patch: Partial<UIComponent>) => void
  removeComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  undo: () => void
  redo: () => void
  loadProjectFromJson: (raw: string) => void
  serializeProject: () => string
}

function createDefaultComponent(type: ComponentType, x = 20, y = 20): UIComponent {
  const point = snapPoint(x, y)
  if (type === 'button') {
    return {
      id: uuidv4(),
      type,
      x: point.x,
      y: point.y,
      width: 110,
      height: 44,
      text: 'Click Me',
      color: '#2f80ed',
    }
  }

  if (type === 'label') {
    return {
      id: uuidv4(),
      type,
      x: point.x,
      y: point.y,
      width: 120,
      height: 30,
      text: 'Label',
      color: '#111827',
    }
  }

  if (type === 'slider') {
    return {
      id: uuidv4(),
      type,
      x: point.x,
      y: point.y,
      width: 140,
      height: 24,
      min: 0,
      max: 100,
      value: 50,
      color: '#ef4444',
    }
  }

  return {
    id: uuidv4(),
    type,
    x: point.x,
    y: point.y,
    width: 100,
    height: 80,
    src: 'assets/image.png',
  }
}

function cloneProject(project: ProjectSchema): ProjectSchema {
  return {
    screen: { ...project.screen },
    components: project.components.map((item) => ({ ...item })),
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: defaultProject,
  selectedId: null,
  history: [],
  future: [],

  addComponent: (type, x, y) =>
    set((state) => ({
      history: [...state.history.slice(-49), cloneProject(state.project)],
      future: [],
      project: {
        ...state.project,
        components: [...state.project.components, createDefaultComponent(type, x, y)],
      },
    })),

  updateComponent: (id, patch) =>
    set((state) => ({
      history: [...state.history.slice(-49), cloneProject(state.project)],
      future: [],
      project: {
        ...state.project,
        components: state.project.components.map((component) => {
          if (component.id !== id) {
            return component
          }

          const next = { ...component, ...patch }
          return {
            ...next,
            x: snapToGrid(next.x),
            y: snapToGrid(next.y),
            width: Math.max(20, snapToGrid(next.width)),
            height: Math.max(20, snapToGrid(next.height)),
          }
        }),
      },
    })),

  removeComponent: (id) =>
    set((state) => ({
      history: [...state.history.slice(-49), cloneProject(state.project)],
      future: [],
      selectedId: state.selectedId === id ? null : state.selectedId,
      project: {
        ...state.project,
        components: state.project.components.filter((component) => component.id !== id),
      },
    })),

  selectComponent: (id) => set({ selectedId: id }),

  undo: () =>
    set((state) => {
      const previous = state.history[state.history.length - 1]
      if (!previous) {
        return state
      }
      return {
        project: previous,
        selectedId: null,
        history: state.history.slice(0, -1),
        future: [cloneProject(state.project), ...state.future],
      }
    }),

  redo: () =>
    set((state) => {
      const next = state.future[0]
      if (!next) {
        return state
      }
      return {
        project: next,
        selectedId: null,
        history: [...state.history, cloneProject(state.project)].slice(-50),
        future: state.future.slice(1),
      }
    }),

  loadProjectFromJson: (raw) => {
    const parsed = assertValidProjectSchema(JSON.parse(raw))
    set((state) => ({
      history: [...state.history.slice(-49), cloneProject(state.project)],
      future: [],
      selectedId: null,
      project: cloneProject(parsed),
    }))
  },

  serializeProject: () => JSON.stringify(get().project, null, 2),
}))
