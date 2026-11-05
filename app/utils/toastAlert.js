import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showToast = (message, icon = 'success') => {
  return Toast.fire({
    icon,
    title: message,
  });
};

export const toastSuccess = (msg) => showToast(msg, 'success');
export const toastError = (msg) => showToast(msg, 'error');
export const toastWarning = (msg) => showToast(msg, 'warning');
export const toastInfo = (msg) => showToast(msg, 'info');

export const showConfirm = async (title, text, confirmButtonText = 'Confirmar') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#712b39',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
  });
};

export default Toast;
