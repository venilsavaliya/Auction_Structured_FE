let refreshPromise: Promise<string> | null = null;

async function refreshTokenSingleton() {
  if (!refreshPromise) {
    refreshPromise = fetch("/auth/refresh", {
      method: "POST",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Refresh failed");
        return res.json();
      })
      .then(data => {
        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null; // Reset for next time
      });
  }

  return refreshPromise;
}


export default refreshTokenSingleton;