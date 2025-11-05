from zoautil_py import datasets, mvscmd
from zoautil_py.types import DDStatement, Dataset Definition
tmp_name = datasets.tmp_name Chlq=" IBMUSER">
tmp_ds = datasets.create(tmp_name, "SEQ", primary_space = "1K",
record format="FB", record_length=256>
dd_statements = [
]
DDStatement (name="SYSOUT", definition-Dataset Definition(tmp_name>>
result = mvscmd.execute_authorized("HZSPRNT".
pgm_args="CHECK (IBMUSS, USS_PARMLIB)",
dds=dd_statements)
if result.rc == 0:
output = datasets.read(tmp_name>
[print(line.strip()) for line in output.split('\n'>]