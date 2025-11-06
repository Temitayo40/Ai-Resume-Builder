import axios from "axios";
import toast from "react-hot-toast";

const AxiosError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    toast.error(backendMessage || "An unexpected error occurred");
  } else {
    toast.error("Something went wrong");
  }
};

export default AxiosError;
