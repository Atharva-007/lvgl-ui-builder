import type { ProjectSchema, UIComponent } from '../../frontend/src/types'

function sanitizeLabel(text: string): string {
  return text.replace(/"/g, '\\"')
}

function emitComponent(component: UIComponent, index: number): string[] {
  const varName = `${component.type}_${index}`
  const lines: string[] = []

  if (component.type === 'button') {
    lines.push(`lv_obj_t * ${varName} = lv_btn_create(lv_scr_act());`)
    lines.push(`lv_obj_set_pos(${varName}, ${component.x}, ${component.y});`)
    lines.push(`lv_obj_set_size(${varName}, ${component.width}, ${component.height});`)
    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
    lines.push(`lv_label_set_text(${varName}_label, "${sanitizeLabel(component.text ?? 'Button')}");`)
    lines.push(`lv_obj_center(${varName}_label);`)
    return lines
  }

  if (component.type === 'label') {
    lines.push(`lv_obj_t * ${varName} = lv_label_create(lv_scr_act());`)
    lines.push(`lv_label_set_text(${varName}, "${sanitizeLabel(component.text ?? 'Label')}");`)
    lines.push(`lv_obj_set_pos(${varName}, ${component.x}, ${component.y});`)
    return lines
  }

  if (component.type === 'slider') {
    lines.push(`lv_obj_t * ${varName} = lv_slider_create(lv_scr_act());`)
    lines.push(`lv_obj_set_pos(${varName}, ${component.x}, ${component.y});`)
    lines.push(`lv_obj_set_size(${varName}, ${component.width}, ${component.height});`)
    lines.push(`lv_slider_set_range(${varName}, ${component.min ?? 0}, ${component.max ?? 100});`)
    lines.push(`lv_slider_set_value(${varName}, ${component.value ?? 50}, LV_ANIM_OFF);`)
    return lines
  }

  lines.push(`lv_obj_t * ${varName} = lv_img_create(lv_scr_act());`)
  lines.push(`lv_obj_set_pos(${varName}, ${component.x}, ${component.y});`)
  lines.push(`lv_obj_set_size(${varName}, ${component.width}, ${component.height});`)
  lines.push(`/* TODO: bind image source for ${varName} */`)
  return lines
}

export function generateLvglCode(project: ProjectSchema): string {
  const body = project.components.flatMap((component, index) => emitComponent(component, index))
  return [
    '#include "lvgl.h"',
    '',
    'void ui_init(void) {',
    ...body.map((line) => `  ${line}`),
    '}',
    '',
  ].join('\n')
}
