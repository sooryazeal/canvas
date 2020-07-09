function rectShpOnClick(event) {
    let shape = event.target.closest('svg');
    markMouseDown(shape)
}

function withinPalette(cloned_shape) {
    paletteBox = document.querySelector('#palette').getBoundingClientRect();
    clonedShapeBox = cloned_shape.getBoundingClientRect();
    withinX = clonedShapeBox.left >= paletteBox.left && clonedShapeBox.left <= paletteBox.right
    withinY = clonedShapeBox.top >= paletteBox.top && clonedShapeBox.top <= paletteBox.bottom
    return withinX && withinY
}

function pointWithinPalette(x, y) {
    paletteBox = document.querySelector('#palette').getBoundingClientRect();
    withinX = x >= paletteBox.left && x <= paletteBox.right
    withinY = y >= paletteBox.top && y <= paletteBox.bottom
    return withinX && withinY
}

function rectShpOnMove(event) {
    selected_shape = document.querySelector('#shapes .mousedown');
    cloned_shape = document.querySelector('#g_board .mousedown.cloned');
    if (!!selected_shape) {
        if (!cloned_shape) {
            within = pointWithinPalette(event.clientX, event.clientY)
            if (!within) {
                cloned_shape = selected_shape.cloneNode(true)
                cloned_shape.classList.add('cloned')
                // append to g_board
                svg = document.querySelector('#g_board').appendChild(cloned_shape);
            }
        }
        if (cloned_shape) {
            if (cloned_shape.id.substr(0,8) == "rect_shp" || cloned_shape.id.substr(0,7) == "dmd_shp"|| cloned_shape.id.substr(0,8) == "crcl_shp") {
                cloned_shape.setAttribute("width", "15vw");
                cloned_shape.setAttribute("height", "20vh");
                cloned_shape.setAttribute('x', percentageOfAbsX(event.clientX - cloned_shape.width.baseVal.value/2));
                cloned_shape.setAttribute('y', percentageOfAbsY(event.clientY - cloned_shape.height.baseVal.value/2));
            } else {
                cloned_shape.setAttribute("width",  "10vw");
                cloned_shape.setAttribute("height", "5vh");
                cloned_shape.setAttribute('x', percentageOfAbsX(event.clientX, true, 1, 90));
                cloned_shape.setAttribute('y', percentageOfAbsY(event.clientY,true, 1, 85));
            }
        }
    }
}

function rectShpOnUp(event) {
    removeClass('svg', ['selected'])
    let mouseDownShapes = document.querySelectorAll('#shapes .mousedown');
    mouseDownShapes.forEach(function(x) {
        x.classList.add("selected");
    });
    removeClass('svg', ['mousedown', 'resize', 'moved', 'br', 'bl', 'tl', 'tr'])
    cloned_shape = document.querySelector('#g_board .cloned');
    if (!!cloned_shape) {
        within = withinPalette(cloned_shape)
        if (within) {
        // Also support moving palette
            cloned_shape.remove()
        } else {
            cloned_shape.setAttribute("class", "selected");
            cloned_shape.setAttribute("onmousedown", "rectOnClick(evt)");
            cloned_shape.setAttribute("onmousemove", "rectOnMove(evt)")
            cloned_shape.setAttribute("onmouseup", "rectOnUp(evt)")
            cloned_shape.setAttribute("onclick", "rectOnSelected(evt)")
            if (cloned_shape.id == "rect_shp" || cloned_shape.id == "dmd_shp" || cloned_shape.id == "crcl_shp") {
                cloned_shape.setAttribute("stroke", "#bbbbbb");
                cloned_shape.setAttribute("id", cloned_shape.id.split("_")[0] + new Date().getTime());
                cloned_shape.setAttribute("width", "15vw");
                cloned_shape.setAttribute("height", "20vh");
            } else {
                cloned_shape.setAttribute("width", "10vw");
                cloned_shape.setAttribute("height", "5vh");
                cloned_shape.setAttribute("stroke", "none");
                cloned_shape.setAttribute("style", "overflow: visible");
                cloned_shape.setAttribute("id", 'text' + new Date().getTime());
                cloned_shape.setAttribute("ondblclick", "textOnDblClick(evt)")
                cloned_shape.dispatchEvent(
                    new MouseEvent('dblclick',
                        {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                        }
                    )
                )
            }
        }
    }
}
