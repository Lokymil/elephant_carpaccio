import { networkInterfaces } from "os";

export const getIp = () => {
  const nets = networkInterfaces();
  const ips = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets?.[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }

  return ips.filter((ip) =>
    ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
  )[0];
};
