require('dotenv').config()
const express = require('express')
const http = require('http')

class Server {
    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.port = process.env.PORT || 5001
    }

    async initialize() {
        try{
            console.log('server initialized');
            
        }
        catch(err) {
            console.log(err)
        }
    }

    async start() {
        try {
            this.initialize()
            
        } catch (error) {
            console.log(error)
        }
    }
}
const appServer = new Server()
appServer.start()