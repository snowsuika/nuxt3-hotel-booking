export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  // const { $swal } = useNuxtApp();
  const token = useCookie('auth');

  const baseURL = 'http://localhost:3005/api/v1';

  const isClient = import.meta?.client ?? process.client;

  if (isClient && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }

  if (!token.value) {
    console.log('no token');

    // await $swal.fire({
    //   position: 'center',
    //   icon: 'error',
    //   title: '請重新登入',
    //   timer: 3000,
    //   showConfirmButton: false
    // });
    return navigateTo('/login');
  }

  try {
    await $fetch('/user/check', {
      baseURL,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
  } catch (error) {
    const { message } = error.response._data;
    console.log('error', error.response._data);

    token.value = null;
    // $swal.fire({
    //   position: 'center',
    //   icon: 'error',
    //   timer: 3000,
    //   title: message || '請重新登入',
    //   showConfirmButton: false
    // });

    return navigateTo('/login');
  }
});
