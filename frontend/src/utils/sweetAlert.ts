import Swal from 'sweetalert2';


type ShowAlertType = {
  title: string;
  text: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
  isToast?: boolean;
}

type ShowConfirmType = {
  title: string;
  text: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
  fn: any;
};

export const ShowAlert = (props: ShowAlertType) => {
   Swal.fire({
    position: 'top-end',
    title: props.title,
    text: props.text,
    icon: props.icon,
    toast: props.isToast || false,
    confirmButtonText: 'OK',
  });
};


export const ShowConfirm = (props: ShowConfirmType) => {
  Swal.fire({
    title: props.title,
    text: props.text,
    icon: props.icon,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then(props.fn);
};