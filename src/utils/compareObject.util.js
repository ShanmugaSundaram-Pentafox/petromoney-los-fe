export const compareObject = (originalData, editedData, commonObj = {}) => {
  let object = { ...commonObj };
  for (const [originalDatakey, originalDatavalue] of Object.entries(originalData)) {
    for (const [editedDatakey, editedDatavalue] of Object.entries(editedData)) {
      if (originalDatakey == editedDatakey && originalDatavalue != editedDatavalue) {
        object[editedDatakey] = editedDatavalue;
      }
    }
  }
  return object;
}