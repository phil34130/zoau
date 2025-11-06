const ds=require('./lib/zoau.js').datasets;  
ds.listMembers("PRICHAR.PYTHON.JCL", {})     
  .then(console.log)                         
  .catch(console.error);         