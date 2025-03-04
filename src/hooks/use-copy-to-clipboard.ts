
import { useState } from 'react';
import { toast } from 'sonner';

type CopyToClipboardResult = [boolean, (text: string, message?: string) => Promise<void>];

export function useCopyToClipboard(): CopyToClipboardResult {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, successMessage = 'Copied to clipboard!'): Promise<void> => {
    if (!navigator.clipboard) {
      toast.error('Clipboard API not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy: ', error);
      toast.error('Failed to copy to clipboard');
      setCopied(false);
    }
  };

  return [copied, copy];
}
