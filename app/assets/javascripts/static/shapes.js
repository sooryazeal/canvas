function rectShpOnClick(event) {
    let otherShapes = document.querySelectorAll('#shapes .shape');
    otherShapes.forEach(function(x) {
        x.setAttribute("class", 'shape');
    });

    let shape = event.target.parentNode;
    shape.classList.add("selected")

    shape.classList.add("mousedown"); // marks mousedown
}

function rectShpOnMove(event) {
    target = event.target;
    selected_shape = document.querySelector('#shapes .mousedown');
    cloned_shape = document.querySelector('#g_board .mousedown.cloned');
    if (!!selected_shape) {
        if (!cloned_shape) {
            cloned_shape = selected_shape.cloneNode(true)
            cloned_shape.classList.add('cloned')
            // append to g_board
            svg = document.querySelector('#g_board').appendChild(cloned_shape);
            selected_shape = cloned_shape
        }
        cloned_shape.setAttribute('x', event.clientX - 15);
        cloned_shape.setAttribute('y', event.clientY - 15);
    }
}

function rectShpOnUp(event) {
    let mouseDownShapes = document.querySelectorAll('#shapes .mousedown');
    mouseDownShapes.forEach(function(x) {
        x.setAttribute("class", "shape selected");
    });

    let selectedShapes = document.querySelectorAll('#g_board .selected');
    selectedShapes.forEach(function(x) {
        x.classList.remove("selected");
    });
    cloned_shape = document.querySelector('#g_board .cloned');
    location_x = cloned_shape.x.baseVal.value
    if (!!cloned_shape) {
        if (location_x < 255) {
            cloned_shape.remove()
        } else {
            cloned_shape.setAttribute("class", "selected");
            cloned_shape.setAttribute("id", 'rect' + new Date().getTime());
            cloned_shape.setAttribute("width", "120");
            cloned_shape.setAttribute("height", "75");
            cloned_shape.setAttribute("onmousedown", "rectOnClick(evt)");
            cloned_shape.setAttribute("onmousemove", "rectOnMove(evt)")
            cloned_shape.setAttribute("onmouseup", "rectOnUp(evt)")
        }
    }
}
