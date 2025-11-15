const requestLogger = require('./requestLogger')
const helmet = require('helmet')

const setupMiddleware = (app)=>{
    app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}))
    
    app.use(requestLogger)
}