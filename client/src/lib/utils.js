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

export const getArrowHeadPath=(x1,y1,x2,y2,arrowLength=10,arrowAngle=Math.PI/6)=>
{
  // Calculate the angle of the line
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Calculate the points for the arrowhead
  const x3 = x2 - arrowLength * Math.cos(angle - arrowAngle);
  const y3 = y2 - arrowLength * Math.sin(angle - arrowAngle);
  const x4 = x2 - arrowLength * Math.cos(angle + arrowAngle);
  const y4 = y2 - arrowLength * Math.sin(angle + arrowAngle);

  // Construct the SVG path string
  const path = `M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} L ${x2},${y2} L ${x4},${y4} Z`;

  return path;
}

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
