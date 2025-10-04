import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Share2, Copy, MessageCircle } from "lucide-react";
import { shareViaWhatsApp, shareViaNative, copyToClipboard, generateShareMessage } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  toolName: string;
  description?: string;
  profession?: string;
  freeLimit?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ShareButton({ 
  toolName, 
  description, 
  profession, 
  freeLimit,
  variant = "outline",
  size = "icon"
}: ShareButtonProps) {
  const { toast } = useToast();

  const handleNativeShare = async () => {
    const shared = await shareViaNative({
      title: toolName,
      description: description || generateShareMessage(toolName, profession, freeLimit),
    });
    
    if (!shared) {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    shareViaWhatsApp({
      title: toolName,
      description: description || `Check out this amazing AI tool${profession ? ` for ${profession}` : ''}!`,
    });
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast({ title: "Link copied!" });
    } else {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleNativeShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
