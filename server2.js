const mdns = require('mdns');
const browser = mdns.createBrowser(mdns.tcp('http'));
browser.on('serviceUp', service => {
  console.log('Service found:', service);
});

browser.on('serviceDown', service => {
  console.log('Service lost:', service);
});
browser.start();
setTimeout(() => {
  browser.stop();
}, 10000); // Stop scanning after 10 seconds (adjust as needed)
