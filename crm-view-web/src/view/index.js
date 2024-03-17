import viewImplementation from '@/view/vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const mountView = () => {
    viewImplementation.mountView();
}

const navigate = (route) => {
    viewImplementation.navigate(route);
}

export {
    mountView,
    navigate
}