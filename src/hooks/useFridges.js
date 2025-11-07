// src/hooks/useFridges.js
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function useFridges(pollMs = 5000) {
  const [fridges, setFridges] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("fridges")
      .select("*")
      .order("last_updated", { ascending: false });

    if (error) {
      console.error("Error loading fridges:", error.message || error);
      setFridges([]);
    } else {
      if (mounted.current) setFridges(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    mounted.current = true;
    load();

    const id = setInterval(() => {
      load();
    }, pollMs);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  return { fridges, loading, reload: load };
}
