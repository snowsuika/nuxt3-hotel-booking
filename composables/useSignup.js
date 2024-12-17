export const useSignup = () => {
  const baseURL = 'http://localhost:3005/api/v1';

  const userSignupObject = ref({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
    address: {
      zipcode: null,
      detail: ''
    }
  });

  const onSignup = async () => {
    const { data, error } = await useFetch('/user/signup', {
      baseURL,
      method: 'POST',
      body: userSignupObject.value,
    });

    if (error.value) {
      throw error.value?.data?.message;
    }

    if (data.value?.status) {
      setAuthCookie(data.value.token);
      return data.value;
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
    userSignupObject,
    onSignup
  };
};
