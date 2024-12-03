import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

const { Modal, Collapse } = bootstrap;

const modal = (element, options) => new Modal(element, options);
const collapse = (element, options) => new Collapse(element, options);

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      modal,
      collapse
    }
  };
});