#!/usr/bin/env python3
# Let's just import the datasets module from zoautils
from zoautil_py import datasets, jobs, zsystem
import sys, os

#Prompt for data set name:
dsname = input("Enter the Sequential Data Set name: ")
dsname = dsname.upper().replace("'","").replace(os.environ.get('LOGNAME')+".","")
dsname = f"'{os.environ.get('LOGNAME')}.{dsname}'"
print(dsname)
#if it exists, say we found it, and we'll use it. Otherwise, ask if we should create it
if (datasets.exists(dsname) == True):
    print("Data set found! We will use it")
else:
    create_new = input("Data set not found. Should we create it? (y/n) : ")
    if (create_new.upper() == "Y"):
        # User wants to create a file
        # This is the part where we create a new data set of the correct type
        datasets.create(dsname,type="SEQ",primary_space="1k",secondary_space="1k")
    else: sys.exit("Without a data set name, we cannot continue. Quitting!")
dsname=dsname.replace("'","")
# Uncomment the correct line of code from the 4 lines below
# which will get the system's linklist representation and assign
# its contents to the variable 'linklist_output'
# https://www.ibm.com/docs/en/zoau/1.2.0?topic=modules-datasets or
# https://www.ibm.com/docs/en/zoau/1.1.1?topic=SSKFYE_1.1.1/python_doc_zoautil/index.html

#linklist_output = zsystem.get_linklist()
linklist_output = zsystem.list_linklist()
#linklist_output = zsystem.link_linklist()
#linklist_data   = zsystem.list_linklist()

#This is just here to show the value of linklist_output
linklist_output = str(linklist_output).replace(',','\n')
print(linklist_output)

# Write the value of linklist_output into our sequential data set, dsname
# This is the data set we created back at dataset.create()
datasets.write(dsname,linklist_output,append=False)

# If everything looks good, run the JCL for this challenge.
# For bonus points (bonus points may not actually exist)
# see if you can submit the JCL through this script.
