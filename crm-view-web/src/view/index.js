import viewImplementation from '@/view/vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const mountView = () => {
    viewImplementation.mount();
}

export {
    mountView
}