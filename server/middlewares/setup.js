const express = require('express')
const requestLogger = require('./requestLogger')
const helmet = require('helmet')
const cors = require('cors')
const config = require('../config/config')

const setupMiddleware = (app)=>{
    app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}))

    app.use(requestLogger)

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    app.use('/uploads', express.static('uploads'));

    const corsOptions = {
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
    optionsSuccessStatus: 200,
    methods: config.CORS.METHODS,
    allowedHeaders: config.CORS.ALLOWED_HEADERS
  }
    app.use(cors(corsOptions))
}

module.exports = setupMiddleware