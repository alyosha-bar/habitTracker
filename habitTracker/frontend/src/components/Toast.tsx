
type ToastProps = {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: (id: number) => void;
}

const Toast = ({id, message, type, onClose}: ToastProps) => {
    return ( 
        <div className={`toast toast-${type}`}>
            <span>{message} - {type}</span>
            <button onClick={() => onClose(id)}>x</button>
        </div>
    );
}
 
export default Toast;