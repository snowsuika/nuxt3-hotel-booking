export const useAuth = () => {
  const baseURL = 'http://localhost:3005/api/v1';
  const router = useRouter();
  const isEnabled = ref(false);

  const userLoginObject = ref({
    email: '',
    password: ''
  });

  const loginAccount = async () => {
    if (isEnabled.value) return; // 防止重複提交

    isEnabled.value = true;

    try {
      const data = await $fetch('/user/login', {
        baseURL,
        method: 'POST',
        body: userLoginObject.value,

        onResponseError({ response }) {
          if (response?.status === 400) {
            throw response?._data?.message || '密碼錯誤';
          }

          if (response && response.status === 404) {
            router.push('/');
            throw response?._data?.message || '此使用者不存在';
          }
        }
      });

      if (data?.status) {
        setAuthCookie(data.token);
        router.push('/');

        return { success: true };
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    } finally {
      isEnabled.value = false;
    }
  };

  const setAuthCookie = (token) => {
    const auth = useCookie('auth', {
      path: '/',
      maxAge: 600
    });
    auth.value = token;
  };

  return {
    isEnabled,
    userLoginObject,
    loginAccount
  };
};
