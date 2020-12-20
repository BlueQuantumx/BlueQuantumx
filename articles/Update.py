from json import dumps, loads
from hashlib import md5
import os, sys
import getopt

workspaceRoot = os.path.dirname(os.path.dirname(sys.argv[0]))
articlesFolder = workspaceRoot + "/articles"
staticFolder = workspaceRoot + "/static"


def generate(filename: str):
  if os.system("pandoc --mathjax \"" + filename +
               "\" -o \"./articles/exports/" +
               os.path.splitext(os.path.basename(filename))[0] +
               ".html\" --template=./static/myTemplate.html -M pagetitle=\"" +
               os.path.splitext(os.path.basename(filename))[0] + "\"") != 0:
    raise Exception("Pandoc Error!")
  # print("pandoc --mathjax \"" + fullFilePath + "\" -o \"./articles/exports/" +
  #       os.path.splitext(os.path.basename(filename))[0] +
  #       ".html\" --template=../static/myTemplate.html -M pagetitle=\"" +
  #       os.path.splitext(os.path.basename(filename))[0] + "\"")
  print("Updating", os.path.basename(filename))


def update():
  data: dict
  with open(articlesFolder + "/md5s.json", "r") as f:
    data = loads(f.read())

  for subFolder in os.walk(articlesFolder):
    for filename in subFolder[2]:
      fullFilePath = subFolder[0] + "/" + filename
      if os.path.splitext(filename)[1] == ".md":
        if data.get(filename).__str__() == "None":
          try:
            generate(fullFilePath)
          except Exception as e:
            print(e.args[0])
          else:
            with open(fullFilePath, "r") as f:
              data[filename] = md5(
                  f.read().encode(encoding="UTF-8")).hexdigest()
        else:
          with open(fullFilePath, "r") as f:
            md5sum = md5(f.read().encode(encoding="UTF-8")).hexdigest()
          if (md5sum != data[filename]):
            try:
              generate(fullFilePath)
            except Exception as e:
              print(e.args[0])
            else:
              data[filename] = md5sum

  data = dumps(data)
  with open(articlesFolder + "/md5s.json", "w+") as f:
    f.write(data)


def publish(filename: str):
  data: list
  with open(staticFolder + "/articles.json", "r") as f:
    data = loads(f.read())
  fileBaseName = os.path.basename(filename)
  fileBaseNameNoExt = os.path.splitext(fileBaseName)[0]
  if data.count(fileBaseNameNoExt) == 0:
    data.insert(0, fileBaseNameNoExt)
    print("Publishing " + fileBaseName)
  else:
    print(fileBaseName + " has already been published!")
  with open(staticFolder + "/articles.json", "w+") as f:
    f.write(dumps(data))


if __name__ == "__main__":
  argv = sys.argv[1:]
  try:
    opts, args = getopt.getopt(argv, "-p:", ["publish="])
  except getopt.GetoptError:
    print('Bad arguments! Usage: Update.py [-p | --publish fileName]')
    sys.exit(2)

  if opts.__len__() == 0:
    update()
  else:
    for opt, arg in opts:
      if opt in ("-p", "--publish"):
        publish(arg)