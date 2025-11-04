from zoautil_py import opercmd, zsystem
import json
import time

# Points to wherever your .json is stored
JSON_PATH = 'izu.json'

RETRY_INTERVAL = 2
MAX_RETRIES = 6  # 6 x 2 = 12 seconds

with open(JSON_PATH, 'r') as json_file:

    data = json.load(json_file)

    # assign the contents of the json to variables
    start_cmd = data['start_cmd']
    display_cmd = data['display_cmd']
    up_msg = data['up_msg']
    down_msg = data['down_msg']

# execute the display  command
zos_response = opercmd.execute(display_cmd)
#print(zsystem.read_console())
print(zos_response.stdout_response)
for _ in range(MAX_RETRIES):

    if down_msg in zos_response.stdout_response:
        print("STC IZUANG1 is not started, will start it now !")
# execute the start  command

        zos_response = opercmd.execute(start_cmd)
#print(zsystem.read_console())
        print(zos_response.stdout_response)
 
        break

    time.sleep(RETRY_INTERVAL)
else:
     if up_msg in zos_response.stdout_response:
        print("STC IZUANG1 is already started !")
           
     else:
        print("status of STC IZUANG1 is unknown....")

