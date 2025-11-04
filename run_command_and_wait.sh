#!/bin/sh
# A simple script with a function...
set -x
function runCmd {
  cmd="$1"
  pattern="$2"
  timestamp=`opercmd "${cmd}" | tail -1 | awk '{ print $2 " " $3; }'`
  while [ true ]; do
    pcon -s ${timestamp} | grep "${pattern}"
    if [ $? -eq 0 ]; then
      break;
    fi
    sleep 3
  done
}
###
# Main body of script starts here
###
echo "Start of script..."
runCmd "d iplinfo" "IEE254I" 
echo "End of script..."
