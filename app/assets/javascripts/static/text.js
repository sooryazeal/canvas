function textShpOnClick(event) {
    rectShpOnClick(event)
}

function textShpOnMove(event) {
    rectShpOnMove(event)
}

function textShpOnUp(event) {
    rectShpOnUp(event);
}

function textOnDblClick(event) {
    let shape = event.target.closest('svg')
    let shape_id = shape.getAttribute("id")
    textArea = document.querySelector('#' + shape_id + ' .textarea');
    if (!textArea) {
        let f = document.createElementNS('http://www.w3.org/2000/svg','foreignObject')
        textArea = document.createElement('div')
        textArea.setAttribute('contenteditable', true)
        f.appendChild(textArea)
        shape.append(f)
    }
    textArea.classList.add("textarea")
    setTimeout(function() {
        textArea.focus();
    })

    shape.classList.add("selected")

}
