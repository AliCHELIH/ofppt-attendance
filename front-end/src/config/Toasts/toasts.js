import toast from "react-hot-toast";

export async function successToast(message = null, duration = 2000, position = "top-right") {
    new Audio("/src/assets/sounds/success.mp3").play();
    toast.success(message, {
        duration, position
    });
}


export function errorToast(message = null, duration = 3000, position = "top-right") {
    new Audio("/src/assets/sounds/error.mp3").play();
    toast.error(message, {
        duration, position
    });
}