import axios from "axios";
import toast from "react-hot-toast";

const AxiosError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    // const backendMessage = error.response?.data?.message;
    // toast.error(backendMessage || error.message);
    toast.error(error.message);
  } else {
    toast.error("Something went wrong");
  }
};

export default AxiosError;
