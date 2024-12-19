export default function useBooking() {
  const baseURL = 'http://localhost:3005/api/v1';
  const token = useCookie('auth');
  const { $swal } = useNuxtApp();

  const addOrder = async (options) => {
    const { data, error } = await useFetch(`/orders`, {
      method: 'POST',
      baseURL,
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: options,
      transform: (data) => data.result,
      onResponseError({ response }) {
        console.log(response);

        if (response?.status === 404) {
          $swal.fire({
            position: 'center',
            icon: 'error',
            title: response?._data?.message || '房型不存在',
            timer: 3000,
            showConfirmButton: false
          });
        }

        if (response && response.status === 401) {
          $swal.fire({
            position: 'center',
            icon: 'error',
            title: response?._data?.message || '未授權的訪問，請重新登入',
            timer: 3000,
            showConfirmButton: false
          });
          router.replace('/login');
        }
      }
    });
    if (error.value) {
      throw new Error(error.value?.data?.message);
    }

    return data.value;
  };

  return {
    addOrder
  };
}
