import { existsSync, mkdirSync, writeFileSync } from "fs-extra";
import path from "path";
import readline from "readline";
import { IV2rayConfig, IV2rayConfigInbound, IV2rayConfigOutbound, IV2rayConfigRoutingRule, SERVER_IPS_QA, SERVER_TYPE_QA, UUID } from "./env";

export interface IConfig {
  isRelay?: boolean;
  servers?: string[];
}

export function configV2ray() {
  const config: IConfig = {};
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  serverTypeQA(rl, config);
}

function serverTypeQA(rl: readline.Interface, config: IConfig) {
  rl.question(SERVER_TYPE_QA, (type) => {
    if (/^(a|b)$/.test(type)) {
      if (type === "a") {
        config.isRelay = true;
        serverIpsQA(rl, config);
      } else {
        config.isRelay = false;
        genV2rayConfig(config);
        rl.close();
      }
    } else {
      console.log("输入有误");
      serverTypeQA(rl, config);
    }
  });
}

function serverIpsQA(rl: readline.Interface, config: IConfig) {
  rl.question(SERVER_IPS_QA, (ips) => {
    ips = ips.trim();
    const ipList = ips.split("|");
    if (ipList.filter((ip) => !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{2,5}$/.test(ip)).length) {
      console.log("输入有误");
      serverIpsQA(rl, config);
    } else {
      config.servers = ipList;
      genV2rayConfig(config);
      rl.close();
    }
  });
}

function genV2rayConfig(config: IConfig) {
  let v2rayConfig: IV2rayConfig;
  if (config.isRelay) {
    v2rayConfig = {
      log: { loglevel: "debug" },
      inbounds: config.servers!.map<IV2rayConfigInbound>((ip) => ({
        tag: `inbound-${ip}`,
        protocol: "vmess",
        listen: "0.0.0.0",
        port: +ip.split(":")[1],
        streamSettings: {
          network: "tcp",
          security: "none",
        },
        settings: {
          clients: [{ id: UUID, alterId: 32 }],
        },
      })),
      outbounds: [
        ...config.servers!.map<IV2rayConfigOutbound>((ip) => ({
          tag: `outbound-${ip}`,
          protocol: "vmess",
          streamSettings: {
            network: "tcp",
            security: "none",
          },
          settings: {
            vnext: [
              {
                address: ip.split(":")[0],
                port: 2345,
                users: [{ id: UUID, alterId: 4 }],
              },
            ],
          },
        })),
      ],
      routing: {
        domainStrategy: "IPIfNonMatch",
        rules: config.servers!.map<IV2rayConfigRoutingRule>((ip) => ({
          type: "field",
          inboundTag: [`inbound-${ip}`],
          outboundTag: `outbound-${ip}`,
        })),
      },
    };
  } else {
    v2rayConfig = {
      log: { loglevel: "debug" },
      inbounds: [
        {
          protocol: "vmess",
          listen: "0.0.0.0",
          port: 2345,
          tag: "inbound",
          settings: {
            clients: [{ id: UUID, alterId: 32 }],
          },
        },
      ],
      outbounds: [{ protocol: "freedom", tag: "direct" }],
    };
  }
  if (!existsSync(path.resolve("/etc/v2ray"))) {
    mkdirSync(path.resolve("/etc/v2ray"));
  }
  writeFileSync(path.resolve("/etc/v2ray/config.json"), JSON.stringify(v2rayConfig, null, 2));
  console.log("配置文件创建成功，可以通过v2ray-tools start|stop来启动和停止");
}
