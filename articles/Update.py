import os, sys
import getopt
import http.client
from json import dumps, loads
from hashlib import md5

workspaceRoot = os.path.dirname(os.path.dirname(sys.argv[0]))
articlesFolder = workspaceRoot + "/articles"
buildFolder = workspaceRoot + "/build"

class LeanCloud:
  appID = 'beY1CHJwtpOwXviCEyQJNlN1-gzGzoHsz'
  appKey = 'mRklyzcF05p8jXk0cbRQAe7T'

  def __init__(self) -> None:
    return

  def logIn(self):
    """
    Log in to the remote server
    """
    userName = input("User: ")
    password = input("Password: ")
    conn = http.client.HTTPSConnection("bey1chjw.lc-cn-n1-shared.com")
    payload = dumps({"username": userName, "password": password})
    headers = {
        'Content-Type': 'application/json',
        'X-LC-Id': LeanCloud.appID,
        'X-LC-Key': LeanCloud.appKey
    }
    conn.request("POST", "/1.1/login", payload, headers)
    res = conn.getresponse()
    data = res.read().decode("utf-8")
    data = loads(data)
    self.session = data["sessionToken"]
    print(data["sessionToken"])
    return

  def publish(self, file: str):
    """
    Publish an article to remote server
    """
    self.logIn()
    conn = http.client.HTTPSConnection("bey1chjw.lc-cn-n1-shared.com")
    payload = dumps({"name": file})
    headers = {
        'X-LC-Id': LeanCloud.appID,
        'X-LC-Key': LeanCloud.appKey,
        'Content-Type': 'application/json',
        'X-LC-Session': self.session
    }
    conn.request("POST", "/1.1/classes/Article", payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(data.decode("utf-8"))


def generate(filename: str):
  print("Updating", os.path.basename(filename))
  if os.system("pandoc --mathjax \"" + filename + "\" -o \"../build/articles/exports/" +
               os.path.splitext(os.path.basename(filename))[0] +
               ".html\" --template=../build/static/myTemplate.html -M pagetitle=\"" +
               os.path.splitext(os.path.basename(filename))[0] + "\"") != 0:
    
    raise Exception("Pandoc Error!")
  """ print("pandoc --mathjax \"" + filename + "\" -o \"../build/articles/exports/" +
        os.path.splitext(os.path.basename(filename))[0] +
        ".html\" --template=../build/static/myTemplate.html -M pagetitle=\"" +
        os.path.splitext(os.path.basename(filename))[0] + "\"")
  """ 
  print("Updated", os.path.basename(filename))


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

  data = dumps(data, sort_keys=True, separators=(',', ': '), indent=2)
  with open(articlesFolder + "/md5s.json", "w+") as f:
    f.write(data)


def publish(filename: str):
  opt = str(input("Remote?"))
  fileBaseName = os.path.basename(filename)
  fileBaseNameNoExt = os.path.splitext(fileBaseName)[0]
  if opt == 'y':
    LC.publish(fileBaseNameNoExt)
  else:
    data: list
    with open(buildFolder + "/articles/articles.json", "r") as f:
      data = loads(f.read())
    if data.count(fileBaseNameNoExt) == 0:
      data.insert(0, fileBaseNameNoExt)
      print("Publishing " + fileBaseName)
    else:
      print(fileBaseName + " has already been published!")
    with open(buildFolder + "/articles/articles.json", "w+") as f:
      f.write(dumps(data, sort_keys=True, separators=(',', ': '), indent=2))


if __name__ == "__main__":
  argv = sys.argv[1:]
  LC = LeanCloud()
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
