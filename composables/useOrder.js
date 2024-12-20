export default function useOrder() {
  const baseURL = 'http://localhost:3005/api/v1';
  const token = useCookie('auth');
  const { $swal } = useNuxtApp();

  const orderDetail = ref(null);

  const addOrder = async (options) => {
    try {
      const result = await $fetch(`/orders`, {
        method: 'POST',
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: options
      });

      return result.result;
    } catch (error) {
      // 處理錯誤狀態
      if (error.response?.status === 404) {
        $swal.fire({
          position: 'center',
          icon: 'error',
          title: error.response?._data?.message || '房型不存在',
          timer: 3000,
          showConfirmButton: false
        });
      }

      if (error.response?.status === 401) {
        $swal.fire({
          position: 'center',
          icon: 'error',
          title: error.response?._data?.message || '未授權的訪問，請重新登入',
          timer: 3000,
          showConfirmButton: false
        });
        router.replace('/login');
      }

      throw new Error(error.response?._data?.message);
    }
  };

  const getOrderDetail = async (id) => {
    const { data, error } = await useFetch(
      `/orders/${id}`,
      {
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        },

        onResponseError({ response }) {
          if (response?.status === 404) {
            alert('房間資料取得錯誤');
            return navigateTo('/404');
          }

          if (response && response.status === 401) {
            alert('未授權的訪問，請重新登入');
            router.replace('/login');
          }
        }
      }
    );
    if (error.value) {
      throw new Error(error.value?.data?.message);
    }

    orderDetail.value = data.value?.result;
  };

  return {
    addOrder,
    getOrderDetail,
    orderDetail
  };
}
