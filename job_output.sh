job="STC04540"
opts='-d'
pcon ${opts} | awk -vjob="${job}" '
 BEGIN { trace=0 }
 /^O|^M|^N|^W|^X/ { if ( substr($0 ,38 ,8) == job ) { trace=1; print; } else { trace=0; }  }
 /^S|^L|^E|^D/  { if (trace) { print; } }'
