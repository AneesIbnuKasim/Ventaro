const mongoose = require('mongoose')
const config  = require('./config')
const logger = require('../utils/logger')

class DatabaseConnection {
    constructor() {
        this.isConnected = false
    }
    async connect() {
        try {
          if (this.isConnected) {
            console.log('db connected already')
            return
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMs: 5000,
            socketTimeoutMs: 45000,
            family: 4
        }

        await mongoose.connect(config.MONGODB_URI,options)

        this.isConnected = true
        console.log(`mongodb connected successfully`)
        mongoose.connection.on('error',(err)=>{
          console.log('db connection error:',err)
        })

        mongoose.connection.on('disconnect',()=>{
          console.warn('DB connection disconnected')
          this.isConnected = false
        })

        mongoose.connection.on('reconnect',()=>{
          console.log('DB connection reconnected')
          this.isConnected = true
        })
    }
       catch (error) {
            console.log('db connection failed: ',error)
        }
}

  async disconnect() {
     try {
       await mongoose.connection.close()
      this.isConnected = false
      console.log('db disconnected gracefully')
    }
     catch (error) {
      console.log('Error during mongoDb disconnection', error) 
     }
 }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    }
  }
}

const dbConnection = new DatabaseConnection()

process.on('SIGINT',async()=>{
  await dbConnection.disconnect()
  process.exit(0)
})

module.exports = dbConnection