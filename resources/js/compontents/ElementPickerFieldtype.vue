<template>
    <div class="relative">
        <text-input :value="value" @input="update" class="[&_input]:elpi-pr-9"></text-input>

        <button v-if="!config.url_source" class="btn btn-xs absolute elpi-top-1.5 elpi-right-1.5 elpi-px-0" @click="startPicking" v-tooltip="{content: buttonTooltip, delay: 50, autoHide: false}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="text-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm-6-2a6 6 0 1 1 12 0a6 6 0 0 1-12 0Zm6-4a4 4 0 1 0 0 8a4 4 0 0 0 0-8ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12Zm10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16Z"/></svg>
        </button>

        <button v-if="config.url_source && url" class="btn btn-xs absolute elpi-top-1.5 elpi-right-1.5 elpi-px-0" @click="startPicking" v-tooltip="{content: buttonTooltip, delay: 50, autoHide: false}">
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" class="w-4 elpi-mx-1 text-sm" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48M336 64h112v112M224 288L440 72"/></svg>
        </button>

        <div v-if="config.url_source && !url" class="btn btn-xs elpi-text-yellow-500 hover:!elpi-text-yellow-500 absolute elpi-top-1.5 elpi-right-1.5 elpi-px-0" v-tooltip="{content: buttonTooltipMissingUrl, delay: 50, autoHide: false}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm-1-4h2V7h-2v6Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>
        </div>

        <div v-if="url && !isUrlSameOrigin" class="btn btn-xs text-red-500 absolute elpi-top-1.5 elpi-right-1.5 elpi-px-0" v-tooltip="{content: 'The URL must be on the same origin as the current page.', delay: 50, autoHide: false}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm-1-4h2V7h-2v6Zm1 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"/></svg>
        </div>
    </div>
</template>

<script>
import Picker from '../utils/picker.js'
import { finder } from '@medv/finder'

export default {

    setup() {
        return {
            finder
        }
    },

    mixins: [Fieldtype],

    data() {
        return {
            Picker: null,
            urlComponent: null,
        }
    },

    computed: {
        url() {
            if (this.config.url_source === 'sibling_or_ancestor' && this.urlComponent) {
                return this.urlComponent.value
            }

            if (this.config.url_source === 'field_config') {
                return this.config.url
            }
        },
        buttonTooltip() {
            if (this.url) {
                return `Go to ${this.url} and pick an element`
            } else {
                return 'Pick an element right here'
            }
        },
        buttonTooltipMissingUrl() {
            if (this.config.url_source === 'sibling_or_ancestor' && !this.urlComponent) {
                return `The field "${this.config.url_field_handle}" could not be found.`
            }

            if (this.config.url_source === 'sibling_or_ancestor' && this.urlComponent && !this.urlComponent.value) {
                return `Missing URL in field "${this.urlComponent.config.display}".`
            }

            if (this.config.url_source === 'field_config' && !this.config.url) {
                return `Missing URL in field config.`
            }
        },
        isUrlSameOrigin() {
            if (this.url) {
                try {
                    const url = new URL(this.url)
                    return url.origin === window.location.origin
                } catch (error) {
                    return false
                }
            }
        }
    },

    methods: {
        startPicking() {
            if (this.url) {
                this.startPickingOnUrl()
            } else {
                setTimeout(() => {
                    this.startPickingHere()
                }, 100)
            }
        },
        startPickingHere() {
            this.Picker = new Picker({
                window: window,
                createInspector: true,
                blockRedirection: false,
                click: (element) => {
                    const selector = this.finder(element, {
                        root: document.body
                    })

                    this.update(selector)

                    this.Picker.stop()
                },
            })

            this.Picker.start()
        },
        startPickingOnUrl() {
            const newWindow = window.open(this.url)

            const origin = new URL(this.url).origin

            const messageHandler = (event) => {
                if (event.origin === origin && event.data.source === 'Picker') {
                    this.update(event.data.selector)
                }
            }

            window.addEventListener('message', messageHandler)

            newWindow.onload = () => {
                newWindow.finder = this.finder

                const style = newWindow.document.createElement('style')
                style.innerHTML = '.inspector-element { position: absolute ;z-index: 999; pointer-events: none; border: 2px solid tomato; transition:all .2s; background-color: #b4bb6933 }'
                newWindow.document.head.appendChild(style)

                newWindow.Picker = new Picker({
                    window: newWindow,
                    createInspector: true,
                    blockRedirection: false,
                    click: (element) => {

                        const selector = newWindow.finder(element, {
                            root: newWindow.document.body
                        })

                        window.postMessage({
                            source: 'Picker',
                            selector: selector,
                        }, origin)

                        newWindow.close()

                        setTimeout(() => {
                            window.removeEventListener('message', messageHandler)
                        }, 100)
                    },
                })

                newWindow.Picker.start()
            }
        }
    },

    mounted() {
        if (this.config.url_source === 'sibling_or_ancestor') {
            let parent = this.$parent
    
            while (parent) {
                parent.$children.forEach((child) => {
                    if (child.field && child.field.handle === this.config.url_field_handle) {
                        this.urlComponent = child
                    }
                    else if (child.config && child.config.handle === this.config.url_field_handle) {
                        this.urlComponent = child
                    }
                })
    
                parent = parent.$parent
            }
        }
    },

}
</script>