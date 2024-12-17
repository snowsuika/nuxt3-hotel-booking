export const useAlert = () => {
  const { $swal } = useNuxtApp();

  const showAlert = ({ icon, title, text, timer }) => {
    return $swal.fire({
      position: 'center',
      icon,
      title,
      text,
      showConfirmButton: !timer,
      timer
    });
  };

  const showSuccessAlert = (title, timer = 1500) => {
    return showAlert({
      icon: 'success',
      title,
      timer
    });
  };

  const showErrorAlert = (title, timer = 1500) => {
    return showAlert({
      icon: 'error',
      title,
      timer
    });
  };

  return {
    showAlert,
    showSuccessAlert,
    showErrorAlert
  };
};
