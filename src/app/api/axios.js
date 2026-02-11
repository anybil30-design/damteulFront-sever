import axios from "axios";

const api = axios.create({
  baseURL: "https://port-0-damteulback-server-mlhcddsk6f7f8eac.sel3.cloudtype.app",
  timeout: 10000, // 10초
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;