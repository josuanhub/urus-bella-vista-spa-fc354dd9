import { useState, useCallback } from "react";

const BASE_URL    = "https://www.urusverify.com/v1/client/fc354dd9-3e44-49af-a8ee-a0e23a48dfda/api";
const FACTORY_KEY = "factory2026";

/**
 * fetchApi — cliente HTTP base para Bella Vista Spa.
 *
 * @param {string} endpoint   - Ruta relativa, ej: "/clientes" o "/clientes/1"
 * @param {RequestInit} opts  - Opciones nativas de fetch (method, body, etc.)
 * @returns {Promise<{ data: any, status: number, ok: boolean }>}
 */
export async function fetchApi(endpoint = "", opts = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type":  "application/json",
    "x-factory-key": FACTORY_KEY
  };

  const config = {
    ...opts,
    headers: {
      ...defaultHeaders,
      ...(opts.headers ?? {})
    }
  };

  // Serializar body automáticamente si es objeto
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  let data = null;
  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ?? `Error ${response.status}: ${response.statusText}`
    );
    error.status = response.status;
    error.data   = data;
    throw error;
  }

  return { data, status: response.status, ok: response.ok };
}

/**
 * useApi — hook React para consumir fetchApi con estado de carga y error.
 *
 * @returns {{ request, data, loading, error, reset }}
 *
 * Ejemplo:
 *   const { request, data, loading, error } = useApi();
 *   await request("/clientes", { method: "GET" });
 */
export function useApi() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const request = useCallback(async (endpoint, opts = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchApi(endpoint, opts);
      setData(result.data);
      return result;
    } catch (err) {
      setError({
        message: err.message,
        status:  err.status  ?? null,
        data:    err.data    ?? null
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, data, loading, error, reset };
}

export default useApi;