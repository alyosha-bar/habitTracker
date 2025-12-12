import type { ToastType } from "../App";
import Toast from "./Toast";

type ToastListProps = {
    data: ToastType[]
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    removeToast: (id: number) => void;
}

const ToastList = ({data, position, removeToast}: ToastListProps) => {
    return ( 
        <div className={`toast-list ${position || 'top-right'}`}>
            {data.map(toast => (
                <Toast id={toast.id} type={toast.type} message={toast.message} onClose={removeToast} />
            ))}
        </div>
    );
}
 
export default ToastList;