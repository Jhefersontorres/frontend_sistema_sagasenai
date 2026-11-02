import json
import os
from pathlib import Path
import shutil
from urllib.parse import urlparse


ROOT = Path(__file__).parent
PUBLIC = ROOT / "public"
STATIC_DIRECTORIES = ("assets", "html", "js", "style")


def build_frontend():
    api_url = os.getenv("SISTEMA_GP_API_URL", "").strip().rstrip("/")
    if os.getenv("VERCEL") == "1" and not api_url:
        raise RuntimeError(
            "SISTEMA_GP_API_URL must be set to the deployed backend URL."
        )
    if api_url:
        parsed_url = urlparse(api_url)
        if (
            parsed_url.scheme != "https"
            or not parsed_url.netloc
            or parsed_url.username
            or parsed_url.password
            or parsed_url.query
            or parsed_url.fragment
        ):
            raise ValueError(
                "SISTEMA_GP_API_URL must be an HTTPS base URL without credentials, "
                "query, or fragment."
            )

    if not (ROOT / "index.html").is_file():
        raise FileNotFoundError("index.html was not found.")

    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    PUBLIC.mkdir()
    shutil.copy2(ROOT / "index.html", PUBLIC / "index.html")

    for directory in STATIC_DIRECTORIES:
        source = ROOT / directory
        if not source.is_dir():
            raise FileNotFoundError(f"{directory}/ was not found.")
        shutil.copytree(source, PUBLIC / directory)

    config_path = PUBLIC / "js" / "config.js"
    config = config_path.read_text(encoding="utf-8")
    placeholder = 'const DEPLOY_API_URL = "";'
    if placeholder not in config:
        raise ValueError("The API URL build placeholder was not found.")
    config = config.replace(
        placeholder,
        f"const DEPLOY_API_URL = {json.dumps(api_url)};",
        1,
    )
    config_path.write_text(config, encoding="utf-8")


if __name__ == "__main__":
    build_frontend()
