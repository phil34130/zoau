from zoautil_py import jobs, datasets

jcl_template = """
//PRICHARZ JOB (ACCT#1),'JCL FROM PYTHON',
//     CLASS=A,
//     MSGCLASS=X,NOTIFY=&SYSUID
//* 
//STEP1     EXEC PGM=SORT
//SYSPRINT  DD  SYSOUT=* 
//SYSOUT    DD  SYSOUT=*
//SORTIN    DD DSN=PRICHAR.PYTHON.JCL(DATA),DISP=SHR
//* PATH='/u/prichar/python1/data'
//SORTOUT   DD DSN=PRICHAR.PYTHON.SORTOUT1,
//          DISP=(NEW,CATLG),
//          SPACE=(TRK,(5,5)),
//          DCB=(RECFM=FB,LRECL=80,BLKSIZE=800),
//          UNIT=3390
//*
//SYSIN     DD *
 SORT FIELDS=COPY
 OUTREC FIELDS=(1:6,25,26:46,5,50X) 
/*
//* 
"""

mypds = datasets.hlq() + ".PYTHON.JCL"
this_job = mypds + "(TESTJOB)"
datasets.write(dataset=this_job, content=jcl_template)
job_info = jobs.submit(this_job)

print(f"JobId : {job_info.id}")
print(f"Job Name : {job_info.name}")
print(f"Job Owner : {job_info.owner}")

job_info.wait()
job_info.refresh()
print(f"Job Status : {job_info.status}")
print(f"Job RC : {job_info.rc}")
