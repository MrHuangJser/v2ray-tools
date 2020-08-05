import { exec } from "child_process";
import { Command } from "commander";
import { configV2ray } from "./config";
import { downloadV2rayCore } from "./install";
import { writeFileSync, readFileSync } from "fs-extra";
import path from "path";

const program = new Command();

program.command("install").action(() => {
  downloadV2rayCore()
    .then(() => {
      console.log("安装完成，可以通过v2ray-tools config来配置");
    })
    .catch((err) => console.error(err));
});

program.command("config").action(() => {
  configV2ray();
});

program.command("start").action(() => {
  const std = exec(`cd /usr/local/share/v2ray&& setsid /usr/local/share/v2ray/v2ray -c /etc/v2ray/config.json > /var/log/v2ray.log 2>&1 &`);
  writeFileSync(path.resolve("/etc/v2ray/pid"), std.pid.toString());
  console.log("v2ray 开启成功");
});

program.command("stop").action(() => {
  const pid = readFileSync(path.resolve("/etc/v2ray/pid")).toString();
  if (pid) {
    console.log(`kill -9 ${pid}&&killall /usr/local/share/v2ray/v2ray`);
    exec(`kill -9 ${pid}&&killall /usr/local/share/v2ray/v2ray`)
      .on("close", () => {
        writeFileSync(path.resolve("/etc/v2ray/pid"), "");
        console.log("v2ray 关闭成功");
      })
      .on("error", () => {
        console.log("v2ray 关闭失败");
      });
  }
});

program.parse();
