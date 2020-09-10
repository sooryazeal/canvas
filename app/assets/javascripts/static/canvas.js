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
            x_marker_id = x.getAttribute("id") + "_marker"
            x_marker = document.querySelector('#' + x_marker_id)
            x_marker.remove()
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
        showMarker(event)
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

function showMarker(event) {
        arrowStart = null
        nearestShape = null
        allShapes = document.querySelectorAll('#g_board .object')
        allShapes.forEach(function(s) {
            skip = false
            dim = s.getBoundingClientRect()
            topOrBotomOfShape = event.clientX < dim.right && event.clientX > dim.left
            leftOrRightOfShape = event.clientY < dim.bottom && event.clientY > dim.top
            if (topOrBotomOfShape) {
                nearTop = dim.top - event.clientY > -5 && dim.top - event.clientY < 20
                nearBottom = event.clientY - dim.bottom > -5 && event.clientY - dim.bottom < 20
                if (nearTop) {
                    arrowStart = {x: event.clientX, y: s.getAttribute("y")}
                } else if (nearBottom) {
                    arrowStart = {x: event.clientX, y: (parseFloat(s.getAttribute("y").split("v")[0]) + parseFloat(s.getAttribute("height").split("v")[0])).toString() + "vh"}
                }
            }
            if (!arrowStart && leftOrRightOfShape) {
                nearRight = event.clientX - dim.right > -5 && event.clientX - dim.right < 20
                nearLeft = dim.left - event.clientX  > -5 && dim.left - event.clientX < 20
                if (nearRight) {
                    arrowStart = {x: dim.right, y: percentageOfAbsY(event.clientY - 25, true, s.getAttribute("y").split("v")[0], parseFloat(s.getAttribute("y").split("v")[0]) + parseFloat(s.getAttribute("height").split("v")[0]))}
                } else if (nearLeft) {
                    arrowStart = {x: dim.left, y: percentageOfAbsY(event.clientY - 25, true, s.getAttribute("y").split("v")[0], parseFloat(s.getAttribute("y").split("v")[0]) + parseFloat(s.getAttribute("height").split("v")[0]))}
                }
            }
            removeClass('svg', ['nearest'])
            if (arrowStart) {
                nearestShape = s
                nearestShape.classList.add('nearest')
                nearestShape_marker_id = nearestShape.getAttribute("id") + "_marker"
                startDot = document.querySelector("#" + nearestShape_marker_id + ' .start')
                startDot.setAttribute('cx', arrowStart.x)
                startDot.setAttribute('cy', arrowStart.y)
                return
            } else {
                startDots = document.querySelectorAll('.start')
                startDots.forEach(function(startDot) {
                startDot.setAttribute('cx', 0)
                startDot.setAttribute('cy', 0)
                })
            }
        })
    if (event.target.closest('svg').classList.contains('object')) {
        nearestShape = event.target.closest('svg')
    }
    if (nearestShape) {
        nearestShape_marker_id = nearestShape.getAttribute("id") + "_marker"
        nearestMarker = document.querySelector('#' + nearestShape_marker_id)
        nearestMarker.classList.add('nearest')
    }


    // if clicked when showing red dot start a line
    // when pointer moved change the line
    // when mouse up show arrow head.
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
    y = adjust ? y - document.querySelector('.canvas').getBoundingClientRect().top: y
    result = y*100/document.querySelector('.canvas').clientHeight
    // result = adjust ? result - 11 :result
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


function addvddivby(one, two, div = 1) {
    return (parseFloat(one.split("v")[0]) + parseFloat(two.split("v")[0])/ div).toFixed(2).toString() + "v" + one.split("v")[1]
}



window.onload = initialize
document.onkeydown = deletedSelected
