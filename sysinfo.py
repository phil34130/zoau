import platform
import sys
sys.path.append('./')
print("machine",platform.machine())
print("platform",platform.platform())
print("arch ",platform.architecture())
print("process ",platform.processor())
print("compiler",platform.python_compiler())
print("system ",platform.system())
