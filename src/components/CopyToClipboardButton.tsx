
import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyToClipboardButtonProps extends ButtonProps {
  text: string;
  onCopy?: () => void;
  successMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const CopyToClipboardButton = ({
  text,
  onCopy,
  successMessage = "Copied to clipboard!",
  variant = "outline",
  children,
  ...props
}: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast.success(successMessage);
        if (onCopy) onCopy();
        
        // Reset icon after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={copyToClipboard}
      className="flex-shrink-0"
      {...props}
    >
      {children || (copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />)}
    </Button>
  );
};

export default CopyToClipboardButton;
