export const useBookingStore = defineStore('booking', () => {
  const bookingData = ref({});

  const setBookingData = (data) => {
    bookingData.value = data;
  };

  return {
    bookingData,
    setBookingData
  };
});
