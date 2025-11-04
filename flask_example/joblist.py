#
from zoautil_py import jobs
from zoautil_py import mvscmd, datasets
print(jobs.fetch_multiple(job_owner=datasets.get_hlq()))
