const OpenAI = require("openai");
// const  { OPENAI_API_KEY } = require("./config");

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

module.exports =  client;