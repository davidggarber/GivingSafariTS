import os

kitFiles = [
    'classUtil.ts',
    'notes.ts',
    'storage.ts',
    'textInput.ts',
    'textSetup.ts',
    'boilerplate.ts'
]

merged = []
cwd = os.getcwd()
print('Running in ' + cwd)
if not cwd.endswith('kit'):
  os.chdir('./kit')
  cwd = os.getcwd()
  print('chdir to ' + cwd)

for srcFile in kitFiles:
  file = open(srcFile, "r")
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

out = open('kit.ts', "w")
out.writelines(merged)
out.close()