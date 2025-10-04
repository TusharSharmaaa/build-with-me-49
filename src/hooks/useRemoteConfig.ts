import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { updateAdConfig } from "@/lib/ads";

export function useRemoteConfig() {
  const { data: config } = useQuery({
    queryKey: ['remote-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remote_config')
        .select('config_value')
        .eq('config_key', 'ads_config')
        .single();
      
      if (error) throw error;
      return data.config_value as {
        ads: {
          interstitialEveryNDetails: number;
          interstitialMinSeconds: number;
          rewardedEveryNSearches: number;
          rewardedMinSeconds: number;
          bannersEnabled: boolean;
          interstitialEnabled: boolean;
          rewardedEnabled: boolean;
        };
        ui: {
          showTrending: boolean;
        };
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (config?.ads) {
      updateAdConfig(config.ads);
    }
  }, [config]);

  return config;
}
