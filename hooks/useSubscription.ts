import { useCallback, useEffect, useRef, useState } from "react";
import { isInviteModeClient } from "@/lib/clientLaunch";

type Subscription = {
  status: string;
  expires_at: string;
  generation_count: number;
  max_generations: number;
};

export function useSubscription() {
  const inviteMode = isInviteModeClient();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(!inviteMode);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didLoadRef = useRef(false);

  const fetchSubscription = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) {
      if (!didLoadRef.current) setLoading(true);
      else setRefreshing(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/user/subscription");
      if (!res.ok) throw new Error("failed to load");
      const data = await res.json();
      setSubscription(data.subscription ?? null);
    } catch (err) {
      setError("サブスクリプション情報の取得に失敗しました");
    } finally {
      setLoading(false);
      setRefreshing(false);
      didLoadRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (inviteMode) return;
    fetchSubscription();
  }, [fetchSubscription]);

  return { subscription, loading, refreshing, error, refetch: fetchSubscription };
}
