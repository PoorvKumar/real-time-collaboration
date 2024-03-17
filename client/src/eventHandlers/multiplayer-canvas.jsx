export function handleZoom(canvas, setZoomLvl, setVpt) {
    return function (opt) {
        if (opt.e.ctrlKey) {
            let delta = opt.e.deltaY;
            let zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 4) zoom = 4;
            if (zoom < 0.35) zoom = 0.35;
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            setZoomLvl(zoom);
            setVpt({ x: canvas.viewportTransform[4], y: canvas.viewportTransform[5] });
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }
    }
}

export function handleWheelPanning(canvas,setVpt) {
    return function (opt) {
        if (!opt.e.ctrlKey) {
            let delta = opt.e.deltaY;
            let vpt = canvas.viewportTransform;

            if (opt.e.shiftKey) {
                vpt[4] -= delta; // Panning horizontally when scrolling while holding shift key
            }
            else {
                vpt[5] -= delta;  // Panning vertically when scrolling
            }

            canvas.setViewportTransform(vpt);
            setVpt({ x: vpt[4], y: vpt[5] });
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }
    };
}

export function handlePanning(canvas) {
    return (opt) => {
        let evt = opt.e;

        if (evt.altKey) {
            canvas.isPanning = true;
            canvas.selection = false;
            canvas.lastPosX = evt.clientX;
            canvas.lastPosY = evt.clientY;
        }
    };
}

export function handlePanningMove(canvas) {
    return (opt) => {
        if (canvas.isPanning) {
            let e = opt.e;
            let vpt = canvas.viewportTransform;
            vpt[4] += e.clientX - canvas.lastPosX;
            vpt[5] += e.clientY - canvas.lastPosY;

            canvas.setViewportTransform(vpt);
            canvas.lastPosX = e.clientX;
            canvas.lastPosY = e.clientY;
        }
    };
}

export function handlePanningUp(canvas) {
    return (opt) => {
        canvas.isPanning = false;
        canvas.selection = true;
    }
}