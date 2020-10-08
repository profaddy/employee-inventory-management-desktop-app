var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'inventory-node-server-1',
  description: 'This is inventory management node server',
  script: '.\\server.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  console.log("install complete")
  svc.start();
});
 
svc.install();
