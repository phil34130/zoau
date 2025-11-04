#!/bin/sh
#
# Use IEHLIST to get the directory information for a data set.
#
# Copyright IBM Corp. 2022
#

set -e
#et -x
echo $# arguments
if test "$#" -ne 1; then
	echo "usage: $0 <data set name>"
        exit 1
fi
#   if [ "$#" -ne 1 ]; then
#   	echo "usage: $0 <data set name>"
#           exit 1
#   fi

data_set=$1

volume=$(dls -s ${data_set} | awk -F ' ' '{print $5}')

mvscmd --pgm=IEHLIST \
       --sysprint=stdout \
       --dd1=${data_set},shr,volumes=${volume} \
       --sysin=stdin <<zz
 LISTPDS VOL=3390=${volume},FORMAT,                                       X
               DSNAME=${data_set}
zz
