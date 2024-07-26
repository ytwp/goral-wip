import { toast } from "sonner"
import { useAccessStore } from "../store";

export class ClientApi {
  async get(url: string, params: Record<string, any> = {}): Promise<any> {
    let queryString = "";
    if (Object.keys(params).length > 0) {
      queryString = "?" + new URLSearchParams(params).toString();
    }
    const res: Response = await fetch(
      this.path(url + queryString),
      {
        headers: getHeaders(),
        method: "GET"
      });
    if (res.status !== 200) {
      toast.error("网络异常，请重试")
      throw new Error('网络异常，请重试');
    }
    const resJson = await res.json();
    return resJson;
  }

  async post(url: string, body: Record<string, any> = {}): Promise<any> {
    const res: Response = await fetch(
      this.path(url),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...getHeaders()
        },
        method: "POST"
      });
    if (res.status !== 200) {
      toast.error("网络异常，请重试")
      throw new Error('网络异常，请重试');
    }
    const resJson = await res.json();
    return resJson;
  }

  async postRaw(url: string, body: string): Promise<any> {
    const res: Response = await fetch(
      this.path(url),
      {
        body: body,
        headers: {
          ...getHeaders()
        },
        method: "POST"
      });
    if (res.status !== 200) {
      toast.error("网络异常，请重试")
      throw new Error('网络异常，请重试');
    }
    const resJson = await res.json();
    return resJson;
  }

  path(path: string): string {
    const proxyPath = import.meta.env.VITE_PROXY_PATH;
    return [proxyPath, path].join("");
  }
}

function getHeaders(): Record<string, string> {
  const accessStore = useAccessStore.getState();
  const headers: Record<string, string> = {
    "x-requested-with": "XMLHttpRequest",
    "X-Trino-user": "user"
  };

  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  if (validString(accessStore.token)) {
    headers.Authorization = makeBearer(accessStore.token);
  }

  return headers;
}

export const api = new ClientApi();
