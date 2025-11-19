const express = require('express')
const requestLogger = require('./requestLogger')
const helmet = require('helmet')

const setupMiddleware = (app)=>{
    app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}))

    app.use(requestLogger)

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))
}

module.exports = setupMiddleware