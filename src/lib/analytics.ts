// Analytics event tracking

type AnalyticsEvent = 
  | 'open_app'
  | 'view_category'
  | 'view_tool_detail'
  | 'click_open_website'
  | 'search_query'
  | 'search_result_click'
  | 'add_favorite'
  | 'remove_favorite'
  | 'submit_tool'
  | 'ad_banner_impression'
  | 'ad_interstitial_impression'
  | 'ad_rewarded_impression'
  | 'ad_reward_granted';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  console.log('[Analytics]', event, properties);
  
  // In production, this would send to analytics service or Supabase
  // For now, we just log to console
  
  // Example: Store in Supabase analytics table
  // supabase.from('analytics_events').insert({
  //   event_name: event,
  //   properties,
  //   user_id: auth.uid(),
  //   timestamp: new Date().toISOString()
  // });
}
