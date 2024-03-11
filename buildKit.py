import os
from stat import S_IREAD, S_IRGRP, S_IROTH, S_IWRITE

kitFiles = [
    '_classUtil.ts',
    '_tableBuilder.ts',
    '_notes.ts',
    '_decoders.ts',
    '_storage.ts',
    '_textInput.ts',
    '_textSetup.ts',
    '_subway.ts',
    '_dragDrop.ts',
    '_stampTools.ts',
    '_straightEdge.ts',
    '_events.ts',
    '_boilerplate.ts',
    '_confirmation.ts',
    '_builder.ts',
    '_templates.ts',
    '_validatePBN.ts',
]

merged = []
cwd = os.getcwd()
print('Running in ' + cwd)

for srcFile in kitFiles:
  file = open(srcFile, mode="r", encoding="utf-8")
  lines = file.readlines()
  file.close()
  afterImport = 0
  inImport = False
  lineNumber = 0
  for line in lines:
    if inImport and '}' in line:
      inImport = False
      afterImport = lineNumber + 1
    elif line.startswith('import'):
      if '{' in line and not '}' in line:
        inImport = True
      else:
        afterImport = lineNumber + 1
    lineNumber += 1
  merged += ['\n','\n','/*-----------------------------------------------------------\n']
  merged += [' * ' + srcFile + '\n']
  merged += [' *-----------------------------------------------------------*/\n', '\n']
  merged += lines[afterImport:]

os.chmod('kit.ts', S_IWRITE|S_IREAD|S_IRGRP|S_IROTH)  # Temporarily writable by owner
out = open('kit.ts', mode="w", encoding="utf-8")
out.writelines(merged)
out.close()
os.chmod('kit.ts', S_IREAD|S_IRGRP|S_IROTH)  # Readable by anyone (owner/group/others)
