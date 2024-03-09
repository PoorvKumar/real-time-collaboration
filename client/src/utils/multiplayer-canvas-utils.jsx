import { fabric } from "fabric";
import { MousePointer2 } from "lucide-react";

export const drawCursor=(canvas,position,userId,name)=>
{
    // console.log(canvas);
    console.log("Position",position);
    console.log("User:",userId);
    console.log("Name:",name);
    if(canvas)
    {
        // canvas.remove(userId+'_cursor');
        // canvas.remove(userId+'_name');

        let cursorIcon=new fabric.Circle({
            radius: 5,
            fill: 'red',
            originX: 'center',
            originY: 'center',
            left: position.x,
            top: position.y,
            selectable: false,
            id: userId+'_cursor'
        });
        canvas.add(cursorIcon);

        // let svgElem=document.createElementNS("http://www.w3.org/2000/svg","svg");

        // svgElem.setAttribute("width","24");
        // svgElem.setAttribute("height","24");
        // svgElem.innerHTML=MousePointer2;

        // fabric.loadSVGFromString(svgElem.outerHTML,(objects,options)=>
        // {
        //     let icon=fabric.util.groupSVGElements(objects,options);
        //     icon.set({
        //         left: position.x,
        //         top: position.y,
        //         selectable: false,
        //         id: userId+'_cursor'
        //     });

        //     canvas.add(icon);
        // })
    }
};