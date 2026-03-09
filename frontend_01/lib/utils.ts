import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import SweetAlert from "sweetalert2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const showConfirmationDialog = async (title: string, text: string) => {
  const result = await SweetAlert.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
    customClass:{
      confirmButton: 'bg-red-500 text-white py-2 px-4 rounded',
    }
  });
  return result.isConfirmed;
}
