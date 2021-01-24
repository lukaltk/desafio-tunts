const dotenv = require('dotenv')
dotenv.config()

/**
 * Gets the spreadsheet ID from the URL
 * @param   {String} url URL of the spreedsheet
 * @returns {String}     Spreadsheet ID
 */
function getSpreadsheetId(url) {
  return url.match(`/spreadsheets/d/([a-zA-Z0-9-_]+)`)[1]
}

module.exports = {
  spreadsheetId: getSpreadsheetId(process.env.SPREADSHEET_URL),
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  scope: process.env.SCOPE,
  range: process.env.RANGE,
  rangeTotalLessons: process.env.RANGE_TOTAL_LESSONS,
  rangeUpload: process.env.RANGE_UPLOAD,
  absenceLimit: process.env.ABSENCE_LIMIT,
  passingScore: process.env.PASSING_SCORE,
  minimumScore: process.env.MINIMUM_SCORE,
}
