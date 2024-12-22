export const useAlert = () => {
  const { $swal } = useNuxtApp();

  const defaultOptions = {
    timer: 3000,
    position: 'center',
    showConfirmButton: false
  };

  const showSuccessAlert = (title) => {
    return $swal.fire({
      icon: 'success',
      title,
      ...defaultOptions
    });
  };

  const showErrorAlert = (title) => {
    return $swal.fire({
      icon: 'error',
      title,
      ...defaultOptions
    });
  };

  return {
    showSuccessAlert,
    showErrorAlert
  };
};
