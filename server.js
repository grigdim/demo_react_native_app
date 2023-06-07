const mdns = require('mdns');

const serviceName = 'Demo Service';
// const serviceType = '_http._tcp.local';
const servicePort = 3000;

const ad = mdns.createAdvertisement(mdns.tcp('http'), servicePort, {
  name: serviceName,
});

ad.start();

console.log(
  `Demo Service advertising as "${serviceName}" on port ${servicePort}`,
);
