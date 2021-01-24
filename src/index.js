const { google } = require('googleapis')
const { client_email, private_key, scope, spreadsheetId, range, rangeTotalLessons, rangeUpload } = require('./config')
const { arrayToObject, toUpload, cellToNumber } = require('./dataTransformer')

console.log('Creating a client to manipulate the spreadsheet')
const client = new google.auth.JWT(
  client_email,
  null,
  private_key,
  scope
)
console.log(client)

client.authorize(err => {

  console.log('Authenticating the client')

  if(err) return console.log('Authentication failed:', err)

  console.log('Connected')
  gsrun(client)
})

async function gsrun(client) {

  console.log('Configuring the API')
  const gsapi = google.sheets({
    version: 'v4',
    auth: client
  })

  try {
    console.log('Receiving data from the spreadsheet')
    let data = (
      await gsapi.spreadsheets.values.get({spreadsheetId, range})
    ).data.values
    console.log(data)

    console.log('Receiving hte cell of the total lessons from the spreadsheet')
    let totalAulasSemestre = (
      await gsapi.spreadsheets.values.get({spreadsheetId, range: rangeTotalLessons})
    ).data.values
    console.log(totalAulasSemestre)

    console.log('Getting the number of the total lessons')
    totalAulasSemestre = cellToNumber(totalAulasSemestre)
    console.log(totalAulasSemestre)

    console.log('Transforming the received data to object')
    data = arrayToObject(data).map(obj => {
      return {...obj, totalAulasSemestre}
    })
    console.log(data)

    console.log('Preparing data to upload')
    const dataToUpload = toUpload(data)
    console.log(dataToUpload)
  
    console.log('Configuring update options')
    const updateOptions = {
      spreadsheetId: spreadsheetId,
      range: rangeUpload,
      valueInputOption: 'USER_ENTERED',
      resource: { values: dataToUpload }
    }

    console.log('updating')
    const response = await gsapi.spreadsheets.values.update(updateOptions)
    console.log(response)

  } catch(err) {
    console.log(err)
  }
}