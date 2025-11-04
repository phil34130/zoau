#!/usr/bin/env python3                                            
# Let's just import the datasets module from zoautils             
from zoautil_py import datasets                                   
                                                                  
# This line creates a *list* of the data set members              
# inside the data set specified in the argument.                  
# A list, in Python, is a type of data set object that            
# can easily be sorted, appended, counted, reversed, and more     
members_list = datasets.list_members("PRICHAR.CDA.JCL")                
                                                                  
# Here we meet our old friend the *for* loop.                     
# The loop is saying create a new variable called "member"        
# Then, from that number to however long members_list is,         
# print out that number in the list.                              
# The first member in many data structures is indexed at "0"      
# so we'll start with 0 and go up to 2 if there are 3 members.    
# Since we want the output to say "1,2,3.." not "0,1,2..." we     
# say member+1, even though we start counting from 0 in the code. 
for member in range(len(members_list)):                           
    print(str(member+1) + ": " + members_list[member])            
