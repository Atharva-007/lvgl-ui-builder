# LVGL Visual UI Builder

A modern, professional visual UI editor for LVGL (Light and Versatile Graphics Library) with real-time C code generation.

## 🎯 Features

### Component Library (30 Components)
- **Basic Components**: Button, Label, Text Box, Image
- **Input Components**: Checkbox, Radio, Switch, Spinner, Spinbox
- **Selection**: Roller, Tab View, Page View, Calendar
- **Data Visualization**: Chart, Progress Bar, Arc, Gauge, Meter, Line Meter, LED
- **Containers**: Message Box, Button Matrix, Window Box
- **Advanced**: Color Wheel, Canvas, QR Code, Keyboard

### Interactive Editing
- **Drag & Drop**: Add components by dragging from palette to preview
- **Resize & Move**: 4-corner resize handles with snapping
- **Live Preview**: Real-time editing with 320x240 LVGL display simulation
- **Property Editor**: Comprehensive controls for all component properties
- **Undo/Redo**: 50-level history with persistent state management

### Layout Customization
- **5 Presets**: Default, Wide Components, Wide Properties, Max Preview, Compact
- **Manual Adjustment**: Control panel widths, preview size, code pane height
- **Responsive**: Smooth transitions and CSS Grid-based layouts

### LVGL Code Generation
- **Real-time Compilation**: Generate LVGL C code as you edit
- **Smart Component Naming**: Auto-generate or custom name components
- **Export Ready**: Download as ready-to-compile C code
- **Support**: Button, Label, Image, Slider with extensible architecture

### UI/UX
- **Solid Color Theme**: Professional dark blue palette with accent colors
- **Icon-based UI**: Compact 30-component icon library
- **Keyboard Shortcuts**: Undo/Redo buttons in toolbar
- **Project Management**: Save/Load projects as JSON

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ with npm
- Git

### Installation
```bash
cd lvgl-ui-builder/frontend
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:5174/
```

### Build
```bash
npm run build
# Output in dist/
```

## 🛠 Technology Stack

### Frontend
- **React 19** with TypeScript 5.9
- **Vite 8** for fast development and optimized builds
- **Zustand 5** for state management (50-item undo/redo history)
- **Tailwind CSS 3.4** with PostCSS for styling
- **Monaco Editor 4.7** for code preview
- **Konva 10** for canvas rendering

### Backend/Generation
- **TypeScript** code generator for LVGL C output
- **Custom Layout Engine** with grid snapping

### Architecture
```
frontend/
  ├── src/
  │   ├── components/          # UI components (LayoutCustomizer)
  │   ├── panels/              # Feature panels (ComponentLibrary, PropertiesPanel, LivePreviewPanel, CodePanel)
  │   ├── canvas/              # Canvas rendering (CanvasStage for future Electron)
  │   ├── store/               # Zustand state management with undo/redo
  │   ├── utils/               # File I/O utilities
  │   ├── types.ts             # TypeScript type definitions
  │   └── index.css            # Global styling with solid theme
engine/
  ├── generator/               # LVGL C code generator
  ├── parser/                  # Schema validation
  └── layout/                  # Snap-to-grid engine
```

## 📋 Component Properties

### All Components
- **Position**: X, Y coordinates (0-320, 0-240)
- **Size**: Width, Height
- **Name**: Editable component identifier

### Button
- Text content
- Type: Momentary or Toggle
- State: Enabled or Disabled
- Colors: Background, Text, Border
- Styling: Border width, radius

### Label
- Text content
- Alignment: Left, Center, Right
- Colors & styling: Background, Text, Border

### Slider
- Range: Min/Max values with step
- Orientation: Horizontal or Vertical
- Colors: Fill and Track colors
- Tracks value in real-time

### Image
- Source URL
- Fit mode: Cover, Contain, Fill
- Opacity percentage
- Rotation in degrees

## 🎨 Color Palette

- **Primary Dark**: #0f172a
- **Secondary Dark**: #1a2847
- **Tertiary**: #253354
- **Borders**: #3a4f7f (solid)
- **Text Primary**: #e5eaf5
- **Text Secondary**: #b0bfd9
- **Accent Blue**: #3b82f6
- **Accent Orange**: #f97316
- **Danger Red**: #dc2626

## 📦 Project Setup

```json
{
  "screen": {
    "width": 320,
    "height": 240
  },
  "components": [
    {
      "id": "uuid",
      "type": "button",
      "x": 20,
      "y": 20,
      "width": 110,
      "height": 44,
      "text": "Click Me",
      "color": "#3b82f6",
      "fontSize": 14,
      "fontWeight": "bold"
    }
  ]
}
```

## 🔄 Workflow

1. **Add Component**: Click/drag from component library or click icon
2. **Edit Properties**: Adjust all properties in right panel
3. **Position**: Drag component or set X/Y coordinates
4. **Resize**: Use 4-corner handles or Width/Height inputs
5. **Color**: Use color picker and hex input
6. **Preview**: Real-time display updates as you edit
7. **Export**: Download LVGL C code
8. **Save Project**: Export JSON for later editing

## 🚀 Performance

- **Build Time**: ~500ms (production)
- **Bundle Size**: 230 KB JavaScript (70.93 KB gzipped)
- **CSS**: 13 KB (3.69 KB gzipped)
- **Interactive**: 60 FPS drag/resize with snapping

## 📝 Component Generation Example

**Input**: Button at (20, 20), 110x44, "Click Me", Blue (#3b82f6)

**Output LVGL C**:
```c
#include "lvgl.h"

void ui_init(void) {
  lv_obj_t * button_0 = lv_btn_create(lv_scr_act());
  lv_obj_set_pos(button_0, 20, 20);
  lv_obj_set_size(button_0, 110, 44);
  lv_obj_t * button_0_label = lv_label_create(button_0);
  lv_label_set_text(button_0_label, "Click Me");
  lv_obj_center(button_0_label);
}
```

## 🔧 Future Enhancements

- [ ] Electron wrapper for cross-platform desktop app
- [ ] More LVGL component types (Arc, Meter, Gauge)
- [ ] Theme presets (light, dark, custom)
- [ ] Component alignment & distribution tools
- [ ] Grid/guide system
- [ ] Animation property editor
- [ ] Event scripting
- [ ] Multi-screen layouts
- [ ] Responsive breakpoints
- [ ] Component templates/presets

## 📄 License

MIT License - See LICENSE file

## 👤 Author

**Atharva Gawali**
- GitHub: [@Atharva-007](https://github.com/Atharva-007)
- Email: atharvagawali70@gmail.com

---

**Note**: This project is actively maintained. Please open issues for bugs or feature requests.
