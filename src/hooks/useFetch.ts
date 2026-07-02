import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook për data fetching (Ushtrimi Javor 4/8).
 * Kthen `data`, `loading`, `error`, si dhe helper-at `post`, `put`, `remove` dhe `refetch`.
 */
function useFetch<T>(url: string, immediate = true) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gabim gjatë marrjes së të dhënave");
      setData(json as T);
      return json as T;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gabim i panjohur");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) refetch();
  }, [immediate, refetch]);

  const send = useCallback(
    async (method: "POST" | "PUT" | "DELETE", body?: unknown) => {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.json();
    },
    [url]
  );

  const post = useCallback((body: unknown) => send("POST", body), [send]);
  const put = useCallback((body: unknown) => send("PUT", body), [send]);
  const remove = useCallback(() => send("DELETE"), [send]);

  return { data, loading, error, refetch, post, put, remove };
}

export default useFetch;
