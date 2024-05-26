import IErrorViewer from '@/infrastructure/view/IErrorViewer';
import INavigator from '@view/INavigator';
import viewImplementation from '@view/vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const mountView = () => {
  viewImplementation.mount();
};

const navigator = (): INavigator => {
  return viewImplementation.navigator()
}

const errorViewer = (): IErrorViewer => {
  return viewImplementation.errorViewer();
}

export { 
  mountView,
  navigator,
  errorViewer,
};
