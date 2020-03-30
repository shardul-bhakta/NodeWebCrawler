const http   = require('http')
const https  = require('https')
const fs     = require('fs')
const path   = require('path')

const { v4: uuidv4 } = require('uuid')


var downloadPage = (url, protocol) => {
  console.log("Downloading the URL: ", url)

  const httpGetPage = (urlF, next_steps) => {
    protocol.get(urlF, (response) => {
    let buff = ''
    response.on('data', (chunk) => {
      buff += chunk
    })
    response.on('end', () => {
      next_steps(null, buff)
    })
    }).on('error', (error) => {
      console.error("An error in httpGet,", error.message)
      next_steps(error)
    })
  }

  // create the resultFolder using uuidv4 created above
  const resultFolder = uuidv4()
  fs.mkdirSync(resultFolder) // create the result dir synchronously
  httpGetPage(url, (error, data) => {
    if (error) {
      return console.log(error)
    }

    fs.writeFileSync(path.join(process.cwd(), resultFolder, 'url.txt'), url)
    fs.writeFileSync(path.join(process.cwd(), resultFolder, 'file.html'), data)
    console.log('Download complete. Result folder: ', resultFolder)
  })
}

/*      main starts here       */
url = process.argv[2]
// define the protocol to use
if (url.includes('https')) {
  protocol = https
} else {
  protocol = http
}

downloadPage(process.argv[2], protocol)
