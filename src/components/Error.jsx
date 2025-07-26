import { AlertCircle } from "lucide-react";

const Error = ({ message }) => {
  return (
    <span className="text-red-500 text-sm mt-2 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {message}
    </span>
  );
};

export default Error;
