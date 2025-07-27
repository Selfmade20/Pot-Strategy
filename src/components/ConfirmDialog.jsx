import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // "danger", "warning", "info"
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmButton: "bg-red-500 hover:bg-red-600 text-white",
          titleColor: "text-red-600"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white",
          titleColor: "text-yellow-600"
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          confirmButton: "bg-blue-500 hover:bg-blue-600 text-white",
          titleColor: "text-blue-600"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            {styles.icon}
          </div>
          <CardTitle className={`text-lg font-semibold ${styles.titleColor}`}>
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 sm:flex-none ${styles.confirmButton}`}
          >
            {confirmText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmDialog; 