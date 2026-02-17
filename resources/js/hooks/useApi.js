import { useState, useCallback } from "react";
import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios — Laravel Sanctum session auth (Inertia SPA)
|--------------------------------------------------------------------------
| withCredentials sends the session cookie on every request.
| initCsrf() hits /sanctum/csrf-cookie once before any mutating request,
| which sets the XSRF-TOKEN cookie. Axios reads it and sends it back
| automatically as X-XSRF-TOKEN on POST / PUT / DELETE.
*/

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Accept"] = "application/json";

let csrfReady = false;

async function initCsrf() {
    if (csrfReady) return;
    await axios.get("/sanctum/csrf-cookie");
    csrfReady = true;
}

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (method, url, data = null, params = null) => {
            if (["post", "put", "patch", "delete"].includes(method)) {
                await initCsrf();
            }

            setLoading(true);
            setError(null);

            try {
                const res = await axios({
                    method,
                    url: `/api${url}`,
                    data,
                    params,
                });
                return res.data;
            } catch (err) {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Something went wrong. Please try again.";
                setError(msg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const get = useCallback(
        (url, params) => request("get", url, null, params),
        [request],
    );
    const post = useCallback(
        (url, data) => request("post", url, data),
        [request],
    );
    const put = useCallback(
        (url, data) => request("put", url, data),
        [request],
    );
    const patch = useCallback(
        (url, data) => request("patch", url, data),
        [request],
    );
    const del = useCallback((url) => request("delete", url), [request]);

    return { get, post, put, patch, del, loading, error, setError };
}
