function textShpOnClick(event) {
    let otherShapes = document.querySelectorAll('#shapes .shape');
    otherShapes.forEach(function(x) {
        x.setAttribute("class", 'shape');
    });

    let shape = event.target.closest('svg');
    shape.classList.add("selected")

    shape.classList.add("mousedown"); // marks mousedown
}

function textShpOnMove(event) {
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

function textShpOnUp(event) {
    // fix css and show cursor
    // cursor show and hide events
    //word wrap
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
            cloned_shape.setAttribute("width", "120");
            cloned_shape.setAttribute("height", "75");
            cloned_shape.setAttribute("stroke", "none");
            cloned_shape.setAttribute("style", "overflow: visible");
            cloned_shape.setAttribute("id", 'text' + new Date().getTime());
            cloned_shape.setAttribute("onmousedown", "rectOnClick(evt)");
            cloned_shape.setAttribute("onmousemove", "rectOnMove(evt)")
            cloned_shape.setAttribute("onmouseup", "rectOnUp(evt)")
            cloned_shape.setAttribute("ondblclick", "textOnDblClick(evt)")
        }
    }
    shape_text = document.querySelector('#' + cloned_shape.id + ' text');
    shape_text.remove()
}

function textOnDblClick(event) {
    let shape = event.target.closest('svg')
    let shape_id = shape.getAttribute("id")
    textArea = document.querySelector('#' + shape_id + ' .textarea');
    if (!textArea) {
        let f = document.createElementNS('http://www.w3.org/2000/svg','foreignObject')
        f.setAttribute('style', 'max-width: 100%')
        f.setAttribute('width', '100%')
        f.setAttribute('height', '100%')
        textArea = document.createElement('div')
        textArea.setAttribute('style', 'stroke-width: 0;max-width: inherit; resize: none; margin: 3px;min-height: 70px;border: none;outline: unset;')
        textArea.setAttribute('width', 'inherit')
        textArea.setAttribute('contenteditable', 'true')
        textArea.setAttribute('height', 'inherit')
        f.appendChild(textArea)
        shape.append(f)
    }
    textArea.classList.add("textarea")
    setTimeout(function() {
        textArea.focus();
    })

    shape.classList.add("selected")

}
