import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LayerType } from "../constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const getLayerData=(type,startPosition,endPosition)=>
{
  switch(type)
  {
    case LayerType.Text:
    case LayerType.Rectangle:
      const x = Math.min(startPosition.x, endPosition.x);
      const y = Math.min(startPosition.y, endPosition.y);
      const width=Math.abs(endPosition.x-startPosition.x);
      const height=Math.abs(endPosition.y-startPosition.y);
      return { x, y, width, height };

    case LayerType.Ellipse:
      const cx = startPosition.x + (endPosition.x - startPosition.x) / 2;
      const cy = startPosition.y + (endPosition.y - startPosition.y) / 2;
      const rx = Math.abs((endPosition.x - startPosition.x) / 2);
      const ry = Math.abs((endPosition.y - startPosition.y) / 2);
      return { cx, cy, rx, ry };

    case LayerType.Arrow:
    case LayerType.Line:
      return { x1: startPosition.x, y1: startPosition.y, x2: endPosition.x, y2: endPosition.y };
      
    default:
      return null;
  }
};

export function getSvgPathFromStroke(stroke)
{
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
