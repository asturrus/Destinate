import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        let url;
        if (Array.isArray(queryKey) && queryKey.length > 1) {
          url = queryKey.join('/');
        } else {
          url = queryKey[0];
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      },
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5000,
    },
  },
});

export async function apiRequest(method, url, data) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}
