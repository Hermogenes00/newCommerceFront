const expres = require('express')
const router = expres.Router()

//Import Admin Routes
const userRoute = require('./admin/userRoute')



//Import loja Routes
router.use('/admin', userRoute)



module.exports = router