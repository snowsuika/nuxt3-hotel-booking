import TWzipcode from 'twzipcode.js';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      TWzipcode: (element, options) => {
        return new TWzipcode(element, options);
      }
    }
  };
});
