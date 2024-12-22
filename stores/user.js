export const useUserStore = defineStore('userStore', () => {
  const token = useCookie('auth');
  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.public.apiBase;
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const userInfo = ref(null);

  const getUserInfo = async () => {
    const { data, error } = await useFetch(`/user`, {
      baseURL,
      headers: { Authorization: token },
      onResponseError({ response }) {
        if (response?.status === 403) {
          showErrorAlert(response.message || '未授權的訪問，請重新登入');
          return navigateTo('/login');
        }
      }
    });

    if (error.value) {
      throw error.value || '獲取用戶資料失敗';
    }

    userInfo.value = data.value?.result;
    return data.value?.result;
  };

  const updateUserInfo = async (options) => {
    const response = await $fetch(`/user`, {
      method: 'PUT',
      baseURL,
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: options
    });

    // update Store
    userInfo.value = response.result;

    return response.result;
  };

  return {
    userInfo,
    getUserInfo,
    updateUserInfo
  };
});
