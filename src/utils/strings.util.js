export const getFileNameFromUrl = (url='', withExtension=true) => {
  const urlArr = url.split("/");
  const fileName = urlArr[urlArr.length-1];
  if(withExtension) {
    return fileName;
  }
  const fileNameArr = fileName.split(".");
  fileNameArr.pop();
  return fileNameArr.join(".");
}