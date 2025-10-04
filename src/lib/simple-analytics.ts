// Simple analytics with console logging

type EventName =
  | "open_app"
  | "view_category"
  | "view_tool_detail"
  | "search_submit"
  | "search_result_click"
  | "favorite_add"
  | "favorite_remove"
  | "share_tool"
  | "submit_tool"
  | "click_open_website";

export function trackEvent(event: EventName, data?: Record<string, any>) {
  console.log(`[Analytics] ${event}`, data);
}
