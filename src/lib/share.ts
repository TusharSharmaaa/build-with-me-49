// Share utilities for WhatsApp, copy link, and native share

export interface ShareOptions {
  title: string;
  description?: string;
  url?: string;
}

export async function shareViaWhatsApp({ title, description, url }: ShareOptions) {
  const text = encodeURIComponent(
    `🔥 ${title}\n\n${description || ''}\n\n👉 ${url || window.location.href}`
  );
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
}

export async function shareViaNative({ title, description, url }: ShareOptions) {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: description || title,
        url: url || window.location.href,
      });
      return true;
    } catch (error) {
      // User cancelled
      return false;
    }
  }
  return false;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

export function generateShareMessage(toolName: string, profession?: string, freeLimit?: string) {
  let message = `🔥 Check out ${toolName} - an amazing AI tool`;
  if (profession) message += ` for ${profession}`;
  message += '!\n\n';
  if (freeLimit) message += `✨ ${freeLimit}\n\n`;
  message += `👉 ${window.location.href}`;
  return message;
}
