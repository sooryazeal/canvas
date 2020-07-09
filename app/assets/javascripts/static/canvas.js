 /*
 *= require_tree .
 *= require_self
 */

function loadOnlyDocumentIfPresent() {
    let boardDom = document.querySelector('#g_board')
    let fileContents = document.querySelector('#file_contents').getAttribute('data-source')
    if (!!fileContents) {
        svgCode = new DOMParser().parseFromString(fileContents, 'image/svg+xml')
        content = svgCode.documentElement.children
        len = content.length
        for (i = 1; i < len; i++) {
            boardDom.appendChild(content.item(1))
        }
        d3.select("body").html(d3.select("body").html())
    }
}

function saveClick() {
    g_board = document.querySelector('#g_board')
    file_contents = encodeURI(g_board.outerHTML)
    Rails.ajax({
        url: "/canvas/save",
        type: "post",
        data: "file_contents=" + file_contents
    })
}

function deletedSelected(event) {
    selected = []
    if(event.keyCode == 8 || event.keyCode == 46) {
        selected = document.querySelectorAll("#g_board .selected")
    }
    if (!document.activeElement.classList.contains("textarea")) {
        selected.forEach(function(x) {
            x.remove()
        })
    }
};

function removeClass(selector = '#g_board .selected', classes = ['selected']) {
    document.querySelectorAll(selector).forEach(function(x) {
        classes.forEach(function(c) {
            x.classList.remove(c)
        })
    })
}

function initialize() {
    loadOnlyDocumentIfPresent()
    const boardObj = document.querySelector('#board')
    boardObj.addEventListener('mousedown', (event) => {
        event.preventDefault()
    })
    boardObj.addEventListener('mousemove', (event) => {
        event.preventDefault()
        rectOnMove(event)
        rectShpOnMove(event)
        textShpOnMove(event)
    })
    boardObj.addEventListener('mouseup', (event) => {
        removeClass('#g_board .selected', ['selected'])
        textArea = document.querySelector('.textarea');
        if (!!textArea) {
            textArea.blur();
        }
        let mouseDwnShapes = document.querySelectorAll('#g_board .mousedown')
        mouseDwnShapes.forEach(function(x) {
            if(x.classList.contains('shape')) {
                if(x.id == 'rect_shp') {
                    rectShpOnUp(event)
                } else {
                    textShpOnUp(event)
                }
            }
        })
        removeClass('#g_board .mousedown', ['mousedown'])
    });

    undoredo()
    fmt()
}

function isWritingBold() {
  return document.queryCommandState('bold');
}

function markMouseDown(shape) {
    removeClass('svg', ['selected', 'mousedown', 'resize', 'br', 'bl', 'tl', 'tr'])
    shape.classList.add("selected")
    shape.classList.add("mousedown"); // marks mousedown
}

function percentageOfAbsX(x, flag = true, start = 1, end = 80) {
    result = x*100/document.querySelector('.canvas').clientWidth
    result = xBox(result.toFixed(2), start, end)
    return flag ? result.toString() + "vw" : result
}

function toggleOptions() {
    options.style.display = options.style.display == 'none' ? 'block' : 'none'
}

function percentageOfAbsY(y, flag = true, start = 1, end = 69, adjust = true) {
    result = y*100/document.querySelector('.canvas').clientHeight
    result = adjust ? result - 11 :result
    result = yBox(result.toFixed(2), start, end)
    return flag ? result.toString() + "vh" : result
}

function xBox(value, start = 1, end = 80) {
    value = Math.min(value, end)
    return Math.max(start, value)
}

function yBox(value, start = 1, end = 69) {
    value = Math.min(value, end)
    return Math.max(start, value)
}



window.onload = initialize
document.onkeydown = deletedSelected
