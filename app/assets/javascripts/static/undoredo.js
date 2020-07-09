var stack = new Undo.Stack()

function undoredo() {
    startValue = document.querySelector('#g_board').outerHTML
    var dom = document.querySelector('#g_board')
    var EditCommand = Undo.Command.extend({
        constructor: function (dom, oldValue, newValue) {
            this.dom = dom
            this.oldValue = oldValue
            this.newValue = newValue
        },
        execute: function() {
                    },
        undo: function () {
            redraw(this.oldValue)
        },
        redo: function () {
            redraw(this.newValue)

        },
        redraw: function (value) {
            this.dom = (new DOMParser().parseFromString(value, 'image/svg+xml')).documentElement
            dom.replaceWith(this.dom)
            d3.select("body").html(d3.select("body").html())
        }
    })

    var observer = new MutationObserver(function (mutations) {
        mutations = filterRelevant(mutations)
        if (mutations.length == 0) {
            return
        }
        console.log(mutations)
        newValue = dom.outerHTML
        stack.execute(new EditCommand(dom, startValue, newValue))
        startValue = newValue
    })

    observer.observe(dom, {
        attributes: true,
        attributeOldValue: true,
        childList: true,
        subtree: true
    })
}

function filterRelevant(mutations) {
 return mutations.filter(function(x) {
     return (x.removedNodes.length > 0 && true) || (
        x.attributeName == 'class' && x.oldValue && x.oldValue.indexOf('moved') != -1 && document.querySelector('.moved') == null
    )})
}

function stackUI() {
    document.querySelector('#redo').disabled = !stack.canRedo()
    document.querySelector('#undo').disabled = !stack.canUndo()
}

stack.changed = function () {
    stackUI()
}

function stackRedo () {
    stack.redo()
}

function stackUndo() {
    stack.undo()
}
