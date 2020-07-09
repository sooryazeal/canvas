function boldFmtOnMousedown(evt) {
    document.execCommand('bold')
    evt.target.closest('svg').classList.add("selected")
}

function italicsFmtOnMousedown(evt) {
    document.execCommand('italic')
     evt.target.closest('svg').classList.add("selected")
}

function underlineFmtOnMousedown(evt) {
    document.execCommand('underline')
     evt.target.closest('svg').classList.add("selected")
}

function fmt() {
    // document.querySelector('.textarea').onfocus = document.onselectionchange = e =>
    // document.querySelector('#bold_fmt').classList.toggle('selected', isWritingBold());
}
