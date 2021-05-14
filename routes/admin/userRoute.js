const express = require('express')
const router = express.Router()



router.get('/login', (req, res) => {
    res.render('adm/login/login')
})

router.post('/login', (req, res) => {
    
    let { body } = req;
    
    res.json(body)
})




module.exports = router