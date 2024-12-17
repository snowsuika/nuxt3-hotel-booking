export const useUserStore = defineStore('userStore', () => {
  const baseURL = 'http://localhost:3005/api/v1';
  const userInfo = ref({});

  const getUserInfo = async (token) => {
    const data = await $fetch(`/user`, {
      baseURL,
      headers: { Authorization: token },
      transform: (data) => data.result
    });

    userInfo.value = data.result;
  };

  return {
    userInfo,
    getUserInfo
  };
});