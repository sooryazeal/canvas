function rectOnClick(event) {
    let otherShapes = document.querySelectorAll('#g_board svg');
    otherShapes.forEach(function(x) {
        x.classList.remove("selected");
        x.classList.remove("mousedown");
        x.classList.remove("resize");
    });

    let shape = event.target.closest('svg');
    shape.classList.add("selected")
    // if corner
    width = event.clientX - shape.x.baseVal.value
    height = event.clientY - shape.y.baseVal.value
    x_close_to_end = width > 0.90 * shape.width.baseVal.value
    y_close_to_end = height > 0.80 * shape.height.baseVal.value
    if (x_close_to_end && y_close_to_end) {
        shape.classList.add("resize"); // marks resize
    }

    shape.classList.add("mousedown"); // marks mousedown
    shape.setAttribute("data-x", event.clientX - shape.x.baseVal.value)
    shape.setAttribute("data-y", event.clientY - shape.y.baseVal.value)
}

function rectOnMove(event) {
    target = event.target;
    selected_shape = document.querySelector('#g_board .mousedown');
    resized_shape = document.querySelector('#g_board .resize.mousedown');
    if (!!resized_shape) {
        resized_shape.setAttribute('width', event.clientX - resized_shape.x.baseVal.value + 20);
        resized_shape.setAttribute('height', event.clientY - resized_shape.y.baseVal.value + 20);
        textarea = resized_shape.querySelector('.textarea')
    } else if (!!selected_shape) {
        let width = selected_shape.getAttribute("data-x");
        let height = selected_shape.getAttribute("data-y");
        clientX = event.clientX - width
        if (!selected_shape.classList.contains('shape')) {
            clientX = Math.max(250,event.clientX - width)
        }
        board = document.querySelector('#board')
        board_width = board.width.baseVal.value + board.x.baseVal.value
        clientX = Math.min(clientX, board_width - selected_shape.width.baseVal.value)
        selected_shape.setAttribute('x', clientX);
        selected_shape.setAttribute('y', event.clientY - height);
    }
}

function rectOnUp(event) {
    let mouseDownShapes = document.querySelectorAll('#g_board .mousedown');
    mouseDownShapes.forEach(function(x) {
        x.classList.remove("mousedown");
        x.classList.remove("resize");
    });
}
