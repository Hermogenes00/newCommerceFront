const axios = require('axios')


const newAxios = token => {

    return axios.create({
        baseURL: process.env.BASE_URL_API,
        timout: 1000,
        header: {
            'Authorization': `Bearer ${token}`
        }
    })
}

module.exports = { axios: newAxios }