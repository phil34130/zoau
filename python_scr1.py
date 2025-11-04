#!/bin/env python

from io import StringIO
import os
import sys

def r(cmd):
    import subprocess
    return subprocess.Popen(cmd, stdout=subprocess.PIPE).communicate()[0]

def allocate_dataset(dsName):
    name = "'" + dsName + "'"
    out = r(['/bin/tso', 'alloc',  'ds(' + name + ')',  'space(6000 2000)',  'track', 'lrecl(80)',
             'dsntype(library)', 'blksize(3200)',  'recfm(f b)',  'dir(2)',  'new'])
    for line in out.split():
        print(line)

def not_allocated(dsName):
    name = "'" + dsName + "'"
    out = r(['/bin/tsocmd', 'listds ' + name])
    for line in out.split():
        if    b"NOT IN CATALOG" in out:
            return True
    return False

def ascii_to_ebcdic(from_codepage, to_codepage, fileName):
    os.system('iconv -f' + from_codepage + ' -t' + to_codepage + fileName + ' >ebcdic_' + fileName)

def copy_to_dataset(fileName, dsName, memberName):
    dsn = "//'" + dsName + '(' + memberName + ")'"
    os.system('cp -T ' + fileName + ' "' + dsn + '"')

def main():
    dsName = "PRICHAR.MY.PYTHON"
    if not_allocated(dsName):
        print("Allocating '" + dsName + "' data set")
        allocate_dataset(dsName)
    ascii_to_ebcdic("UTF-8", "IBM-1047 ", "test1.txt")
    copy_to_dataset("ebcdic_test1.txt", "PRICHAR.MY.PYTHON", "TXT")
    member = "//'PRICHAR.MY.PYTHON(TXT)'"
    os.system('cat -v "' + member + '"')

main()
#!/bin/env python

from io import StringIO
import os
import sys

def r(cmd):
    import subprocess
    return subprocess.Popen(cmd, stdout=subprocess.PIPE).communicate()[0]

def allocate_dataset(dsName):
    name = "'" + dsName + "'"
    out = r(['/bin/tso', 'alloc',  'ds(' + name + ')',  'space(6000 2000)',  'track', 'lrecl(80)',
             'dsntype(library)', 'blksize(3200)',  'recfm(f b)',  'dir(2)',  'new'])
    for line in out.split():
        print(line)

def not_allocated(dsName):
    name = "'" + dsName + "'"
    out = r(['/bin/tsocmd', 'listds ' + name])
    for line in out.split():
        if    b"NOT IN CATALOG" in out:
            return True
    return False

def ascii_to_ebcdic(from_codepage, to_codepage, fileName):
    os.system('iconv -f' + from_codepage + ' -t' + to_codepage + fileName + ' >ebcdic_' + fileName)

def copy_to_dataset(fileName, dsName, memberName):
    dsn = "//'" + dsName + '(' + memberName + ")'"
    os.system('cp -T ' + fileName + ' "' + dsn + '"')

def main():
    dsName = "PRICHAR.MY.PYTHON"
    if not_allocated(dsName):
        print("Allocating '" + dsName + "' data set")
        allocate_dataset(dsName)
    ascii_to_ebcdic("UTF-8", "IBM-1047 ", "test1.txt")
    copy_to_dataset("ebcdic_test1.txt", "PRICHAR.MY.PYTHON", "TXT")
    member = "//'PRICHAR.MY.PYTHON(TXT)'"
    os.system('cat -v "' + member + '"')

main()
