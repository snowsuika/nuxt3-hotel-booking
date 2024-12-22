export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const token = useCookie('auth');
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.public.apiBase;

  const isClient = import.meta?.client ?? process.client;

  if (isClient && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }

  if (!token.value) {
    showErrorAlert('請重新登入');
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
    token.value = null;
    showErrorAlert(message || '請重新登入');

    return navigateTo('/login');
  }
});
