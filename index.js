const express = require('express')
const app = express()
const cookieSession = require('cookie-session')

require('dotenv').config()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET_COOKIE]
}))


//Router
const router = require('./routes/route')
app.use(router)

app.listen(process.env.PORT, () => {
    console.log('Servidor rodando na porta ' + process.env.PORT);
})
