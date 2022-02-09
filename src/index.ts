import express from 'express'
import { registry } from 'api/registry'
const app = express()

app.get('/package/:id/:version?', registry)
