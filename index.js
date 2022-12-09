const fs = require('fs')
const https = require('https')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const fastPatch = require('fast-json-patch')

const privateKey  = fs.readFileSync('ca/key.pem', 'utf8')
const certificate = fs.readFileSync('ca/ingress.pem', 'utf8')
const credentials = {key: privateKey, cert: certificate}

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.send({foo: 'bar'})
})

app.post('/mutate', (request, response) => {
    const admissionReview = request.body
    const newObject = admissionReview.request.object
    const observer = fastPatch.observe(newObject)

    newObject.metadata.annotations['alb.ingress.kubernetes.io/scheme'] = 'internet-facing'
    newObject.metadata.annotations['alb.ingress.kubernetes.io/target-type'] = 'ip'
    newObject.metadata.annotations['alb.ingress.kubernetes.io/group.name'] = 'groupOne'
    newObject.metadata.annotations['alb.ingress.kubernetes.io/listen-ports'] = '[{"HTTPS":443}, {"HTTP":80}]'

    patch = fastPatch.generate(observer)
    const patchString = JSON.stringify(patch)

    const answer = {
        apiVersion: admissionReview.apiVersion,
        kind: admissionReview.kind,
        response: {
            uid: admissionReview.request.uid,
            allowed: true,
            patchType: 'JSONPatch',
            patch: Buffer.from(patchString).toString('base64')
        }
    }
    response.send(answer)
})

const httpsServer = https.createServer(credentials, app)
httpsServer.listen(8443, () => {
    console.log('Listening')
})