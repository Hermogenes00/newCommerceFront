
function CollaboratorAuthSession(req, res, next) {
    req.session.collaborator ? next() : res.redirect('/login')
}

function ClientAuthSession(req, res, next) {
    req.session.client ? next() : res.redirect('/login')
}


module.exports = { CollaboratorAuthSession, ClientAuthSession }