// dns-test.js
import dns from "dns/promises";

try {
  const records = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.q4ytip7.mongodb.net"
  );

  console.log("SRV Records:");
  console.log(records);
} catch (err) {
  console.error("DNS ERROR:", err);
}