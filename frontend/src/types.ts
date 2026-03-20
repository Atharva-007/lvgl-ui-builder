export type ComponentType = 
  | 'button' | 'label' | 'image' | 'slider'
  | 'switch' | 'checkbox' | 'radio' | 'textbox'
  | 'textarea' | 'progressbar' | 'arc' | 'spinner'
  | 'roller' | 'tabview' | 'msgbox' | 'gauge'
  | 'chart' | 'linemeter' | 'spinbox' | 'pageview'
  | 'table' | 'colorwheel' | 'led' | 'btnmatrix'
  | 'meter' | 'canvas' | 'qrcode' | 'calendar'
  | 'keyboard' | 'winbox' | 'droplet'

export interface ScreenConfig {
  width: number
  height: number
}

export interface UIComponent {
  id: string
  type: ComponentType
  x: number
  y: number
  width: number
  height: number
  text?: string
  
  // Colors & Styling
  color?: string // background color
  textColor?: string // text color (button, label)
  borderColor?: string // border color
  borderWidth?: number // border width in pixels
  borderRadius?: number // border radius in pixels
  
  // Typography
  fontSize?: number // font size in pixels
  fontWeight?: 'normal' | 'bold' | 'lighter'
  textAlign?: 'left' | 'center' | 'right'
  
  // Button specific
  state?: 'enabled' | 'disabled'
  buttonType?: 'momentary' | 'toggle'
  
  // Image specific
  src?: string // image source URL
  fitMode?: 'cover' | 'contain' | 'fill'
  rotation?: number // rotation in degrees
  opacity?: number // opacity 0-1
  
  // Slider specific
  value?: number // current value
  min?: number // minimum value
  max?: number // maximum value
  step?: number // step increment
  stepValue?: number // deprecated, use step
  orientation?: 'horizontal' | 'vertical'
  sliderTrackColor?: string // track background color
  sliderFillColor?: string // fill color (progress color)
}

export interface ProjectSchema {
  screen: ScreenConfig
  components: UIComponent[]
}
