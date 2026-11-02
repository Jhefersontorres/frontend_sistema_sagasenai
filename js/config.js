const DEPLOY_API_URL = "";

window.SISTEMA_GP_API_URL =
  window.SISTEMA_GP_API_URL ||
  DEPLOY_API_URL ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://127.0.0.1:8000"
    : "");
