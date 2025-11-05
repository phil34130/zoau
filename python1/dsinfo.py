from zoautil_py import datasets, jobs, zsystem
import sys
dsname = input("Enter the Sequential Data Set name: ")
if (datasets.exists(dsname) == True):
    print("Data set found! We will use it")
else:
    sys.exit("Without a data set name, we cannot continue. Quitting!")

members = datasets.list_members(dsname)

print(f"the dataset members are: {members}\n")
