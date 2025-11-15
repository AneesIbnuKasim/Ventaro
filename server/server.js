require('dotenv').config()
const express = require('express')
const http = require('http')
const dbConnection = require('./config/database')
const config = require('./config/config')
const setupMiddleware = require('./middlewares/setup')

class Server {
    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.port = process.env.PORT || 5001
    }

    async initialize() {
        try{
            await dbConnection.connect()
            
            setupMiddleware(this.app)
            
            console.log('Server initialized successfully')
        }
        catch(err) {
            console.log('Server initialization failed',err)
            process.exit(1)
        }
    }

    async start() {
        try {
            await this.initialize()

            this.server.listen(this.port,()=>{
                console.log(`Server running in ${config.NODE_ENV} Mode on port ${this.port}`)
            })
            
        } catch (error) {
            console.log(error)
        }
        this.setupGracefulShutdown()
    }

    setupGracefulShutdown() {
        const gracefulShutdown = async(signal)=>{
            console.log(`${signal} received, Starting graceful shutdown...`)

            this.server.close(async()=>{
                console.log('HTTP server closed')
            })
            
            await dbConnection.disconnect()
            console.log('Graceful shutdown completed')

            process.exit(0)
        }
        process.on('SIGTERM',()=>gracefulShutdown('SIGTERM'))
        process.on('SIGINT',()=>gracefulShutdown('SIGINT'))
    }

}
const appServer = new Server()
appServer.start()

module.exports = appServer.app