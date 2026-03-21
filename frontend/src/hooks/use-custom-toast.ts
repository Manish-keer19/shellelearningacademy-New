import { useToast } from "@/hooks/use-toast";

type ToastType = 'success' | 'error' | 'warning' | 'info';

const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = (type: ToastType, title: string, description?: string) => {
    const variants = {
      success: "default" as const,
      error: "destructive" as const,
      warning: "default" as const,
      info: "default" as const,
    };

    toast({
      title,
      description,
      variant: variants[type],
    });
  };

  return { showToast };
};

export default useCustomToast;