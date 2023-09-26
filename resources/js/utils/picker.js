// original source: https://github.com/hsynlms/theroomjs
// modified by: Emin Jasarevic

export default class Picker {
    status = 'idle'

    options = {
        namespace: '',
        window: window,
        inspector: null,
        htmlClass: true,
        blockRedirection: false,
        createInspector: false,
        excludes: [],
    }

    constructor(options) {
        this.applyOptions(options)
    }

    getInspector = () => {
        if (typeof this.options.inspector === 'string') {
            // if the provided inspector is a css selector, return the element
            var el = this.options.window.document.querySelector(this.options.inspector)

            if (el) return el
            else throw Error('inspector element not found')
        }

        // eslint-disable-next-line
        if (this.options.inspector instanceof Element) {
            // if the provided inspector is a dom element, return it
            return this.options.inspector
        }

        if (!this.options.inspector && this.options.createInspector) {
            // create an inspector element
            var _inspector = this.options.window.document.createElement('div')
            _inspector.className = 'inspector-element'
            this.options.window.document.body.appendChild(_inspector)
            return _inspector
        }

        throw Error('inspector must be a css selector or a DOM element')
    }

    getExclusionSelector = () => {
        return this.options.excludes.join(',')
    }

    applyOptions = (opts) => {
        if (typeof opts !== 'object')
            throw Error('options is expected to be an object')

        for (var opt in opts) {
            // eslint-disable-next-line
            if (opts.hasOwnProperty(opt)) {
                this.options[opt] = opts[opt]
            }
        }
    }

    eventEmitter = (event) => {
        event.preventDefault()

        // hook event invocation
        // do not emit mouseover and click events
        // if the hook event returns false
        if (this.eventController('hook', event) === false) return

        var target = event.target

        // --skip inspector element itself--
        if (!target || target === this.options.inspector) return

        // do not inspect excluded elements
        var excludedSelector = this.getExclusionSelector()
        if (excludedSelector) {
            var excludedElements = Array.prototype.slice.call(
                this.options.window.document.querySelectorAll(excludedSelector)
            )
            if (excludedElements.indexOf(target) >= 0) return
        }

        if (event.type === 'mouseover') {
            // get target element information
            var pos = target.getBoundingClientRect()
            var scrollTop = this.options.window.scrollY || this.options.window.document.documentElement.scrollTop
            var scrollLeft =
                this.options.window.scrollX || this.options.window.document.documentElement.scrollLeft
            var width = pos.width
            var height = pos.height
            var top = Math.max(0, pos.top + scrollTop)
            var left = Math.max(0, pos.left + scrollLeft)

            this.options.inspector.style.top = top + 'px'
            this.options.inspector.style.left = left + 'px'
            this.options.inspector.style.width = width + 'px'
            this.options.inspector.style.height = height + 'px'
        }

        this.eventController(event.type, target, event)
    }

    engine = (type) => {
        var htmlEl = this.options.window.document.querySelector('html')

        if (type === 'start') {
            if (this.options.blockRedirection === true) {
                // block page redirection
                this.options.window.onbeforeunload = function () {
                    return true
                }
            }

            this.options.window.document.addEventListener('click', this.eventEmitter)
            this.options.window.document.addEventListener('mouseover', this.eventEmitter)

            if (this.options.htmlClass === true)
                htmlEl.className += ' ' + this.options.namespace

            this.status = 'running'
        } else if (type === 'stop') {
            this.options.window.document.removeEventListener('click', this.eventEmitter)
            this.options.window.document.removeEventListener('mouseover', this.eventEmitter)

            if (this.options.htmlClass === true)
                htmlEl.className = htmlEl.className.replace(
                    ' ' + this.options.namespace,
                    ''
                )
            if (this.options.blockRedirection === true)
                this.options.window.onbeforeunload = undefined

            this.status = 'stopped'
        }
    }

    eventController = (type, arg, arg2) => {
        if (!this.options[type]) return
        if (typeof this.options[type] !== 'function')
            throw Error('event handler must be a function: ' + type)

        return this.options[type].call(null, arg, arg2)
    }

    start = (opts) => {
        if (opts) {
            this.configure(opts)
        }

        this.options.inspector = this.getInspector()

        this.eventController('starting')

        this.engine('start')

        this.eventController('started')
    }

    stop = (resetInspector) => {
        this.eventController('stopping')

        this.engine('stop')

        if (resetInspector === true) {
            this.options.inspector.style.top = ''
            this.options.inspector.style.left = ''
            this.options.inspector.style.width = ''
            this.options.inspector.style.height = ''
        }

        if (this.options.createInspector === true) {
            // remove auto generated inspector element on stop
            this.options.inspector.remove()
            this.options.inspector = undefined
        }

        this.eventController('stopped')
    }

    eventBinder = (name, handler) => {
        if (typeof name !== 'string')
            throw Error(
                'event name is expected to be a string but got: ' + typeof name
            )
        if (typeof handler !== 'function')
            throw Error('event handler is not a function for: ' + name)

        this.options[name] = handler
    }
}
