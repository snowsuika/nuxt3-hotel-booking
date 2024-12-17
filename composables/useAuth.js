export const useAuth = () => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const router = useRouter();
  const baseURL = 'http://localhost:3005/api/v1';
  const isEnabled = ref(false);

  const userLoginObject = ref({
    email: '',
    password: ''
  });

  const loginAccount = async () => {
    if (isEnabled.value) return; // 防止重複提交

    isEnabled.value = true;

    try {
      const { data, error } = await useFetch('/user/login', {
        baseURL,
        method: 'POST',
        body: userLoginObject.value,

        onResponseError({ response }) {
          const errorMessage = response?._data?.message || '登入失敗';

          throw new Error(errorMessage);
        }
      });

      if (error.value) {
        throw error.value;
      }

      if (data.value?.status) {
        setAuthCookie(data.value.token);

        await showSuccessAlert('登入成功');
        await router.push('/');
      }

    } catch (error) {
      await showErrorAlert(error);
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
