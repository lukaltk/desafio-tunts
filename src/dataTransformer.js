const ReportCard = require('./ReportCard')

module.exports = {

  /**
   * Transforms the data received to an object
   * @param {Array} data Array with the headers in the first row and the values in the rest of the rows
   * @returns {Object[]} Array of objects where the keys are the headers
   */
  arrayToObject(data) {
    
    const headers = data.shift()
    let objects = []

    for (let i = 0; i < data.length; i++) {

      let tmpArray = []

      for (let j = 0; j < headers.length; j++) {
        tmpArray.push([headers[j], data[i][j]])  
      }
      
      objects = [...objects, Object.fromEntries(tmpArray)]

    }

    return objects

  },

  /**
   * Gets the number in the cell
   * @param   {String} cellValues Cell with a text that contains a number
   * @returns {Number}            Number that was in the cell
   */
  cellToNumber(cellValues){
    return Number(cellValues[0][0].match(/\d+/g)[0])
  },

  /**
   * Transforms the data into a ReportCard, evaluates and return the data to upload
   * @param   {Object[]} data Data to evaluate
   * @returns {Array}         Data to upload
   */
  toUpload(data) {
    let dataToUpload = []

    for(let student = 0; student < data.length; student++) {
      const reportCard = new ReportCard(data[student])
      reportCard.aprove()
      dataToUpload = [...dataToUpload, reportCard.getDataToUpload()]
    }

    return dataToUpload

  }
}