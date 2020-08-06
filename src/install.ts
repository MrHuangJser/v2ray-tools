import Axios from "axios";
import { spawn } from "child_process";

const TOKEN = `7bb5255d9b6d222e1c1b85df564480f3aa7dd964`;

export function downloadV2rayCore() {
  return new Promise((resolve, reject) => {
    Axios.get(`https://api.github.com/repos/v2ray/v2ray-core/releases/latest`, { headers: { Authorization: TOKEN } })
      .then((res) => res.data)
      .then((res) => res.assets.find((item: any) => /linux-64.*\.zip$/.test(item.name)))
      .then((item) => {
        spawn(`wget`, ["-O", "/tmp/v2ray-core.zip", item.browser_download_url], { shell: true, stdio: "inherit" })
          .on("close", () => {
            console.log("下载完成开始解压缩");
            spawn("7z", ["x", "/tmp/v2ray-core.zip", "-aoa", "-o/usr/local/share/v2ray"], { stdio: "inherit" }).on("close", () => resolve());
          })
          .on("error", (err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}
