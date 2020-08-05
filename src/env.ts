export const UUID = `0a4ea3d9-6822-497d-8fa7-b90435cf467d`;

export const SERVER_TYPE_QA = `
当前服务器类型:
 [a]: 中继服务器
 [b]: 终端服务器
 请输入a或b: `;

export const SERVER_IPS_QA = `
请输入终端服务器ip，多个ip用|分割,注意要带端口
端口对应为中继服务器上监听的端口，每个端口对应相应的终端服务器
例如：192.x.x.x:port | 111.x.x.x:port
ip: `;

export type InboundProtocolType = "dokodemo" | "http" | "mtporoto" | "shadowsocks" | "socks" | "vmess";
export type OutboundProtocolType = "blackhole" | "dns" | "freedom" | "http" | "mtporoto" | "shadowsocks" | "socks" | "vmess";

export type ProtocolType = InboundProtocolType & OutboundProtocolType;

export interface IV2rayConfig {
  log?: IV2rayConfigLog;
  api?: IV2rayConfigApi;
  dns?: IV2rayConfigDNS;
  stats?: {};
  routing?: IV2rayConfigRouting;
  policy?: IV2rayConfigPolicy;
  reverse?: IV2rayConfigReverse;
  transport?: IV2rayConfigTransport;
  inbounds?: IV2rayConfigInbound[];
  outbounds?: IV2rayConfigOutbound[];
}

export interface IV2rayConfigLog {
  access?: string;
  error?: string;
  loglevel?: "debug" | "info" | "warning" | "error" | "none";
}

export interface IV2rayConfigApi {
  tag?: string;
  services?: string[];
}
export interface IV2rayConfigDNS {
  host?: { [key: string]: string };
  servers?: ({ address: string; port: number; domains: string[]; expectIps: string[] } | string)[];
}

export interface IV2rayConfigRouting {
  domainStrategy?: "AsIs" | "IPIfNonMatch" | "IPOnDemand";
  rules?: IV2rayConfigRoutingRule[];
  balancers?: IV2rayConfigRoutingBalancer[];
}

export interface IV2rayConfigRoutingRule {
  detail?: boolean;
  type: string;
  domain?: string[];
  ip?: string[];
  port?: number | string;
  network?: "tcp" | "udp" | "tcp,udp";
  source?: string[];
  user?: string[];
  inboundTag?: string[];
  protocol?: ("http" | "tls" | "bittorrent")[];
  attrs?: string;
  outboundTag?: string;
  balancerTag?: string;
}

export interface IV2rayConfigRoutingBalancer {
  tag: string;
  selector: string[];
}

export interface IV2rayConfigPolicy {
  level: {
    [key: string]: {
      handshake: number;
      connIdle: number;
      uplinkOnly: number;
      downlinkOnly: number;
      statsUserUplink: boolean;
      statsUserDownlink: boolean;
      bufferSize: number;
    };
  };
  system: {
    statsInboundUplink: boolean;
    statsInboundDownlink: boolean;
  };
}

export interface IV2rayConfigReverse {
  bridges: { tag: string; domain: string }[];
  portals: { tag: string; domain: string }[];
}

export interface IV2rayConfigTransport {
  tcpSettings?: IV2rayConfigTCPSetting;
  kcpSettings?: IV2rayConfigKCPSetting;
  wsSettings?: IV2rayConfigWSSetting;
  httpSettings?: IV2rayConfigHTTPSetting;
  dsSettings?: IV2rayConfigDSSetting;
  quicSettings?: IV2rayConfigQUICSetting;
}

export interface IV2rayConfigTCPSetting {
  header: {
    type: "none" | "http";
    request: {
      version: string;
      method: string;
      path: string[];
      headers: { [key: string]: string | string[] };
    };
    response: {
      version: string;
      status: string;
      reason: string;
      headers: { [key: string]: string | string[] };
    };
  };
}

export interface IV2rayConfigKCPSetting {
  mtu: number;
  tti: number;
  uplinkCapacity: number;
  downlinkCapacity: number;
  congestion: boolean;
  readBufferSize: number;
  writeBufferSize: number;
  header: {
    type: "none" | "srtp" | "utp" | "wechat-video" | "dtls" | "wireguard";
  };
}

export interface IV2rayConfigWSSetting {
  path: string;
  headers: {
    Host: string;
  };
}

export interface IV2rayConfigHTTPSetting {
  host: string[];
  path: string;
}

export interface IV2rayConfigDSSetting {
  path: string;
}

export interface IV2rayConfigQUICSetting {
  security: "none" | "aes-128-gcm" | "chacha20-poly1305";
  key: string;
  header: {
    type: "none" | "srtp" | "utp" | "wechat-video" | "dtls" | "wireguard";
  };
}

export interface IV2rayConfigInbound {
  port: number;
  listen: string;
  protocol: InboundProtocolType;
  settings?: any;
  streamSettings?: IV2rayConfigStreamSetting;
  tag: string;
  sniffing?: {
    enabled: boolean;
    destOverride: ("http" | "tls")[];
  };
  allocate?: {
    strategy: "always" | "random";
    refresh: number;
    concurrency: number;
  };
}

export interface IV2rayConfigOutbound {
  sendThrough?: string;
  protocol: OutboundProtocolType;
  settings?: any;
  tag: string;
  streamSettings?: IV2rayConfigStreamSetting;
  proxySettings?: {
    tag: string;
  };
  mux?: {
    enabled: boolean;
    concurrency: number;
  };
}

export interface IV2rayConfigStreamSetting extends IV2rayConfigTransport {
  network?: "tcp" | "kcp" | "ws" | "http" | "domainsocket" | "quic";
  security?: "none" | "tls";
  tlsSettings?: IV2rayConfigTLSSetting;
  sockopt?: IV2rayConfigSockOption;
}

export interface IV2rayConfigTLSSetting {
  serverName: string;
  allowInsecure: boolean;
  alpn: string[];
  certificates: IV2rayConfigCertificate[];
  disableSystemRoot: boolean;
}

export interface IV2rayConfigCertificate {
  usage: "encipherment" | "verify" | "issue";
  certificateFile: string;
  certificate: string[];
  keyFile: string;
  key: string[];
}

export interface IV2rayConfigSockOption {
  mark: number;
  tcpFastOpen: boolean;
  tproxy: "redirect" | "tproxy" | "off";
}
