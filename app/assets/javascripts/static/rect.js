function rectOnClick(event) {
    let shape = event.target.closest('svg')
    shape.setAttribute("data-x", event.clientX - shape.x.baseVal.value)
    shape.setAttribute("data-y", event.clientY - shape.y.baseVal.value)
    markMouseDown(shape)

    shapeBox = shape.getBoundingClientRect();
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
        d3.select(shape).data(shapeBox)
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
    rectShpOnMove(event)
    selected_shape = document.querySelector('#g_board .mousedown');
    resized_shape = document.querySelector('#g_board .resize.mousedown');
    if (!!resized_shape) {
            resizedShapeBox = resized_shape.getBoundingClientRect();
        if (resized_shape.classList.contains('br')) {
            resized_shape.setAttribute('width', percentageOfAbsX(event.clientX - resized_shape.x.baseVal.value))
            resized_shape.setAttribute('height', percentageOfAbsY(event.clientY - resized_shape.y.baseVal.value))
        } else if (resized_shape.classList.contains('tl')) {
                resized_shape = d3.select('#g_board .resize.mousedown')
                xPlusw = resized_shape.data('left') + resized_shape.data('width')
                resized_shape
                .attr('x', percentageOfAbsX(event.clientX))
                .attr('width', percentageOfAbsX(xPlusw - event.clientX))
                console.log('newX' + percentageOfAbsX(event.clientX))
                console.log('newWidth' + percentageOfAbsX(xPlusw - event.clientX))
                console.log('xplusw' + percentageOfAbsX(xPlusw))
        } else if (resized_shape.classList.contains('bl')) {
            //bl
            resized_shape.setAttribute('width', percentageOfAbsX(Math.abs(event.clientX - resizedShapeBox.left)))
            resized_shape.setAttribute('height', percentageOfAbsY(Math.abs(event.clientY - resizedShapeBox.top)))
                        resized_shape.setAttribute('x', percentageOfAbsX(event.clientX))

        } else if (resized_shape.classList.contains('tr')) {
            //tr
            console.log(resized_shape.y.baseVal.value)
            console.log(event.clientY)
            console.log(resized_shape.height.baseVal.value)
            resized_shape.setAttribute('width', percentageOfAbsX(Math.abs(event.clientX - resizedShapeBox.left)))
            resized_shape.setAttribute('height', percentageOfAbsY(Math.abs(resized_shape.y.baseVal.value - event.clientY) + resized_shape.height.baseVal.value, true, 1, 69, true))
            resized_shape.setAttribute('y', percentageOfAbsY(event.clientY))
        }
    } else if (!!selected_shape) {
        let width = selected_shape.getAttribute("data-x");
        let height = selected_shape.getAttribute("data-y");
        if (width && height) {
            board = document.querySelector('#board')
            board_width = board.width.baseVal.value + board.x.baseVal.value
            selected_shape.setAttribute('x', percentageOfAbsX(event.clientX - width));
            selected_shape.setAttribute('y', percentageOfAbsY(event.clientY - height, true, 1, 69, false));
        }
    }
    if (selected_shape) {
        selected_shape.classList.add('moved')
    }
}

function rectOnUp(event) {
    rectShpOnUp()
    removeClass('svg', ['mousedown', 'resize', 'moved', 'cloned', 'br', 'bl', 'tl', 'tr'])
}
