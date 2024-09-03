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
    '_contextError.ts',
    '_builder.ts',
    '_builderContext.ts',
    '_builderFor.ts',
    '_builderIf.ts',
    '_builderInput.ts',
    '_builderUse.ts',
    '_templates.ts',
    '_scratch.ts',
    '_meta.ts',
    '_validatePBN.ts',
    '_testUtils.ts',
]

merged = [
  '/************************************************************\n',
  ' * Puzzyl.net puzzle-building web kit                       *\n',
  ' ************************************************************/\n',
]
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

# Each year, start a new kit, to maintain backward compatibility~
kitYear = 'kit24.ts'

if os.path.isfile(kitYear):
  os.chmod(kitYear, S_IWRITE|S_IREAD|S_IRGRP|S_IROTH)  # Temporarily writable by owner
out = open(kitYear, mode="w", encoding="utf-8")
out.writelines(merged)
out.close()
os.chmod(kitYear, S_IREAD|S_IRGRP|S_IROTH)  # Readable by anyone (owner/group/others)
