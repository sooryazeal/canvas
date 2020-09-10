function rectOnClick(event) {
    let shape = event.target.closest('svg')
    shape.setAttribute("data-x", event.clientX - shape.x.baseVal.value)
    shape.setAttribute("data-y", event.clientY - shape.y.baseVal.value)
    markMouseDown(shape)

    shapeBox = shape.getBoundingClientRect();
    d3.select(shape).data([shapeBox.toJSON()])
    width = event.clientX - shapeBox.left
    height = event.clientY - shapeBox.top
    x_close_to_end = width > 0.90 * shape.width.baseVal.value
    y_close_to_end = height > 0.80 * shape.height.baseVal.value
    x_close_to_start = width < 0.10 * shape.width.baseVal.value
    y_close_to_start = height < 0.20 * shape.height.baseVal.value
    if (x_close_to_end && y_close_to_end) {
        shape.classList.add("resize"); // marks resize
        shape.classList.add("br");
    } else if (x_close_to_start && y_close_to_start) {
        shape.classList.add("resize");
        shape.classList.add("tl");
    } else if (x_close_to_start && y_close_to_end) {
        shape.classList.add("resize");
        shape.classList.add("bl");
    } else if (x_close_to_end && y_close_to_start) {
        shape.classList.add("resize");
        shape.classList.add("tr");
    }
}

function rectOnSelected(evt) {
    evt.target.closest('svg').classList.add('selected')
}

function rectOnMove(event) {
    showMarker(event)
    rectShpOnMove(event)
    selected_shape = document.querySelector('#g_board .mousedown');
    resized_shape = document.querySelector('#g_board .resize.mousedown');
    if (!!resized_shape) {
        box = d3.select('#g_board .resize.mousedown').data()[0]
        xPlusw = box['left'] + box['width']
        yPlush = box['top'] + box['height']
        if (resized_shape.classList.contains('br')) {
            resized_shape.setAttribute('width', percentageOfAbsX(event.clientX - resized_shape.x.baseVal.value))
            resized_shape.setAttribute('height', percentageOfAbsY(event.clientY - resized_shape.y.baseVal.value))
        } else if (resized_shape.classList.contains('tl')) {
            resized_shape.setAttribute('x', percentageOfAbsX(event.clientX))
            resized_shape.setAttribute('width', percentageOfAbsX(xPlusw - event.clientX))
            resized_shape.setAttribute('y', percentageOfAbsY(event.clientY))
            resized_shape.setAttribute('height', percentageOfAbsY(yPlush - event.clientY))
        } else if (resized_shape.classList.contains('bl')) {
            resized_shape.setAttribute('x', percentageOfAbsX(event.clientX))
            resized_shape.setAttribute('width', percentageOfAbsX(xPlusw - event.clientX))
            resized_shape.setAttribute('height', percentageOfAbsY(event.clientY - box['top']))
        } else if (resized_shape.classList.contains('tr')) {
            resized_shape.setAttribute('width', percentageOfAbsX(event.clientX - box['left']))
            resized_shape.setAttribute('y', percentageOfAbsY(event.clientY))
            resized_shape.setAttribute('height', percentageOfAbsY(yPlush - event.clientY))
        }
        resized_shape_marker_id = resized_shape.getAttribute("id") + "_marker"
        resized_shape_marker = document.querySelector('#' + resized_shape_marker_id)
        adjustMarker(resized_shape, resized_shape_marker)
    } else if (!!selected_shape) {
        let width = selected_shape.getAttribute("data-x");
        let height = selected_shape.getAttribute("data-y");
        if (width && height) {
            board = document.querySelector('#board')
            board_width = board.width.baseVal.value + board.x.baseVal.value
            selected_shape.setAttribute('x', percentageOfAbsX(event.clientX - width));
            selected_shape.setAttribute('y', percentageOfAbsY(event.clientY - height, true, 1, 69, false));
            selected_shape_marker_id = selected_shape.getAttribute("id") + "_marker"
            selected_shape_marker = document.querySelector('#' + selected_shape_marker_id)
            adjustMarker(selected_shape, selected_shape_marker)
        }
    }
    if (selected_shape) {
        selected_shape.classList.add('moved')
    }
}

function adjustMarker(cloned_shape, cloned_shape_marker) {
    width = cloned_shape.getAttribute("width")
    height = cloned_shape.getAttribute("height")
    x = cloned_shape.getAttribute("x")
    y = cloned_shape.getAttribute("y")
    bc = cloned_shape_marker.querySelector('.bc')
    bc.setAttribute("cx", addvddivby(x, width, 2));
    bc.setAttribute("cy", addvddivby(y, height));
    lc = cloned_shape_marker.querySelector('.lc')
    lc.setAttribute("cx", x);
    lc.setAttribute("cy", addvddivby(y, height, 2));
    tc = cloned_shape_marker.querySelector('.tc')
    tc.setAttribute("cx", addvddivby(x, width, 2));
    tc.setAttribute("cy", y);
    rc = cloned_shape_marker.querySelector('.rc')
    rc.setAttribute("cx", addvddivby(x, width));
    rc.setAttribute("cy", addvddivby(y, height, 2));
}

function rectOnUp(event) {
    rectShpOnUp()
    removeClass('svg', ['mousedown', 'resize', 'moved', 'cloned', 'br', 'bl', 'tl', 'tr'])
}
