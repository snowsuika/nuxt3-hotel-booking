export default function useRoom() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.apiBase;

  const roomList = ref([]);
  const roomDetail = ref(null);

  // Room List
  const getRoomList = async () => {
    const { data, error } = await useFetch(`/rooms`, {
      baseURL,
      transform: (data) => data.result,
      onResponseError({ request, response, options }) {
        if (response?.status === 404) {
          alert('房間資料取得錯誤');
          return navigateTo('/404');
        }

        if (response && response.status === 401) {
          alert('未授權的訪問，請重新登入');
          router.replace('/login');
        }
      }
    });

    if (error.value) {
      throw new Error(error.value);
    }

    roomList.value = data.value;
  };

  // Room Detail
  const getRoomDetail = async (id) => {
    const { data, error } = await useFetch(
      `/rooms/${id}`,

      {
        baseURL,
        transform: (data) => data.result,

        onResponseError({ request, response, options }) {
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

    roomDetail.value = data.value;
  };

  return {
    roomList,
    roomDetail,
    getRoomList,
    getRoomDetail
  };
}
