export default function useOrder() {
  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.public.apiBase;
  const token = useCookie('auth');
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const orderList = ref(null);
  const orderDetail = ref(null);

  const getOrderDetail = async (id) => {
    const { data, error } = await useFetch(`/orders/${id}`, {
      baseURL,
      headers: {
        Authorization: `Bearer ${token.value}`
      },

      onResponseError({ response }) {
        if (response?.status === 404) {
          showErrorAlert('房間資料取得錯誤');
          return navigateTo('/404');
        }

        if (response && response.status === 401) {
          showErrorAlert('未授權的訪問，請重新登入');
          router.replace('/login');
        }
      }
    });
    if (error.value) {
      throw new Error(error.value?.data?.message);
    }

    orderDetail.value = data.value?.result;
  };
  const getOrderList = async () => {
    const { data, error } = await useFetch(`/orders`, {
      baseURL,
      headers: {
        Authorization: `Bearer ${token.value}`
      },

      onResponseError({ response }) {
        if (response?.status === 500) {
          return navigateTo('/');
        }

        if (response?.status === 404) {
          showErrorAlert('房間資料取得錯誤');
          return navigateTo('/404');
        }

        if (response && response.status === 401) {
          showErrorAlert('未授權的訪問，請重新登入');
          router.replace('/login');
        }
      }
    });
    if (error.value) {
      throw new Error(error.value?.data?.message);
    }

    orderList.value = data.value?.result;
  };
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
        showErrorAlert(error.response?._data?.message || '房型不存在');
      }

      if (error.response?.status === 401) {
        showErrorAlert(
          error.response?._data?.message || '未授權的訪問，請重新登入'
        );

        router.replace('/login');
      }

      throw new Error(error.response?._data?.message);
    }
  };
  const deleteOrder = async (id) => {
    try {
      const res = await $fetch(`/orders/${id}`, {
        method: 'DELETE',
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      orderList.value = orderList.value.filter(order => order._id !== res?.result?._id);
      return res;

    } catch (error) {
      // 處理錯誤狀態
      if (error.response?.status === 404) {
        showErrorAlert(error.response?._data?.message || '房型不存在');
      }

      if (error.response?.status === 401) {
        showErrorAlert(
          error.response?._data?.message || '未授權的訪問，請重新登入'
        );

        router.replace('/login');
      }

      throw new Error(error.response?._data?.message);
    }
  };

  return {
    orderDetail,
    orderList,
    getOrderDetail,
    getOrderList,
    addOrder,
    deleteOrder
  };
}
