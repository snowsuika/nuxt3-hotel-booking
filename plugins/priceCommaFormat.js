export default defineNuxtPlugin(() => {
  return {
    provide: {
      priceCommaFormat: (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  };
});