import { fabric } from "fabric";

class Cursor {
    constructor(canvas, userId, name, color) {
        this.canvas = canvas;
        this.userId = userId;
        this.name = name;
        this.color = color;
        this.createCursor();
    }

    createCursor() {
        const cursorIcon = new fabric.Path('M4 4 11.07 21 13.58 13.61 21 11.07z', {
            fill: this.color || 'black',
            selectable: false,
            stroke: 'none',
          });
          cursorIcon.scale(2);
          cursorIcon.set({
            left: 0,
            top: 0,
          });
      
          const cursorText = new fabric.Text(this.name, {
            fontSize: 12,
            selectable: false,
            originX: 'center',
            originY: 'top',
            top: 20,
            fill: 'white',
          });
          const textWidth = cursorText.width * cursorText.scaleX;
          const textHeight = cursorText.height * cursorText.scaleY;
      
          const textBackground = new fabric.Rect({
            width: textWidth + 10, // Add padding
            height: textHeight + 5, // Add padding
            fill: this.color || 'black',
            originX: 'center',
            originY: 'top',
            top: 30, // Adjust position
            selectable: false,
          });
      
          const group = new fabric.Group([cursorIcon, textBackground, cursorText], {
            selectable: false,
          });
      
          this.canvas.add(group);
          this.cursor = group;      
    }

    updatePosition(position) {
        this.cursor.set({ left: position.x, top: position.y });
        this.canvas.renderAll();
    }

    removeCursor() {
        this.canvas.remove(this.cursor);
    }
}

export { Cursor };