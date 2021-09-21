import { toast } from 'react-toastify';

toast.configure();

export function showMessage(data: string) {
    toast(data, { position: toast.POSITION.BOTTOM_LEFT, pauseOnFocusLoss: false })
}