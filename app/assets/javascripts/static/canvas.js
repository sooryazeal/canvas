
var selected_shape = 'rect_shp'

function initialize() {
    var intFrameHeight = window.innerHeight
    var intFrameWidth = window.innerWidth
    var svg = d3.select("#canvas")
        .append("svg")
        .attr("width", intFrameWidth)
        .attr("height", intFrameHeight)

    let board = null
    let file_contents = document.querySelector('#file_contents').getAttribute('data-source')
    if (!!file_contents) {
        svg_dom = document.querySelector('#canvas svg')
        board = new DOMParser().parseFromString(file_contents, 'image/svg+xml')
        svg_dom.appendChild(board.documentElement)
    } else {
        board = svg.append('g').attr('id', 'g_board')
        board.append('rect')
        .attr('id', 'board')
        .attr('x', 250)
        .attr('y', 50)
        .attr('width', intFrameWidth - 300)
        .attr('height', intFrameHeight - 100)
        .attr('stroke', 'black')
        .attr('fill', '#eeeeee')
    }

    let shapes = svg.append('g').attr('id', 'shapes')
    let palette = shapes.append('rect')
    .attr('id', 'palette')
    .attr('x', 50)
    .attr('y', 50)
    .attr('width', 200)
    .attr('height', intFrameHeight - 100)
    .attr('stroke', 'black')
    .attr('fill', '#eeeeee')

    shapes.append('text')
    .attr('x', 60)
    .attr('y', 80)
    .text('Shapes')

    let shp_svg = shapes.append('svg')
    .attr('id', 'rect_shp')
    .attr('class', 'selected shape')
    .attr('x', 60)
    .attr('y', 100)
    .attr('width', 40)
    .attr('height', 25)
    .attr('stroke', 'blue')
    .attr('fill', '#eeeeee')
    // .attr('viewBox', '0 0 40 25')
    rect_shape = shp_svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    // d = "M-3 -3 L-3 28 L43 28 L43 -3 Z"
    // path_shp = shp_svg.append('path').attr('d', d).attr('class', '.path')
    let text_shp_svg = shapes.append('svg')
    .attr('id', 'text_shp')
    .attr('class', 'shape')
    .attr('x', 120)
    .attr('y', 100)
    .attr('width', 40)
    .attr('height', 25)
    .attr('stroke', 'blue')
    .attr('fill', '#eeeeee')
    text_shp_svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('stroke-dasharray', '5 2')
    text_shp_svg.append('text')
    .attr('id', 'rectWrap')
    .attr('class', 'wrap')
    .attr('x', '40%')
    .attr('y', '70%')
    .text('T')
                d3.select("body").html(d3.select("body").html());

    rect_shp = document.querySelector('#rect_shp')
    rect_shp.setAttribute("onmousedown", "rectShpOnClick(evt)");
    rect_shp.setAttribute("onmousemove", "rectShpOnMove(evt)")
    rect_shp.setAttribute("onmouseup", "rectShpOnUp(evt)")

    text_shp = document.querySelector('#text_shp')
    text_shp.setAttribute("onmousedown", "textShpOnClick(evt)");
    text_shp.setAttribute("onmousemove", "textShpOnMove(evt)")
    text_shp.setAttribute("onmouseup", "textShpOnUp(evt)")

    const boardObj = document.querySelector('#board');
    boardObj.addEventListener('mousedown', (event) => {
        event.preventDefault();
    });

    boardObj.addEventListener('mouseup', (event) => {
        document.querySelector('#g_board .selected').classList.remove('selected');
        let mouseDwnShapes = document.querySelectorAll('#g_board .mousedown');
        mouseDwnShapes.forEach(function(x) {
        if(x.classList.contains('shape')) {
            if(x.id == 'rect_shp') {
                rectShpOnUp();
            } else {
                textShpOnUp();
            }
        }
        })
        let mouseDownShapes = document.querySelectorAll('.mousedown');
        mouseDownShapes.forEach(function(x) {
            if(x.classList.contains('shape')) {
                rectShpOnUp();
            }
            x.classList.remove('mousedown');
        });
    });

    boardObj.addEventListener('mousemove', (event) => {
        event.preventDefault();
        rectOnMove(event);
    });

    save_button = document.querySelector('#savebutton');
    save_button.setAttribute("onclick", "saveClick()")

}

function saveClick() {
    g_board = document.querySelector('#g_board')
    file_contents = encodeURI(g_board.outerHTML)
    Rails.ajax({
  url: "/static/save",
  type: "post",
    data: "file_contents=" + file_contents
})
}

// function pathHover() {alert("hi")}

document.onkeydown = function (event) {
    selected = []
    if(event.keyCode == 8 || event.keyCode == 46) {
        selected = document.querySelectorAll("#g_board .selected")
    }
    selected.forEach(function(x) {
        x.remove()
    })

    // g = document.querySelector('#g_board')
    // g.outerHTML pass to svg
};


initialize()
