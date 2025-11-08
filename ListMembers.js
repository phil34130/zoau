const ds=require('./lib/zoau.js').datasets;    
                                               
                                               
const ID = process.env.USER;                   
const DSN = `${ID}.JCL`;                       
                                               
function errfunc(err) {                        
  throw err;                                   
}                                              
                                               
                                               
// ---------------hlq                          
console.log(`List members of ${DSN}`);         
ds.listMembers(DSN, {})                        
  .then(console.log)                           
  .catch(console.error);                       