const router = require( 'express' ).Router()
const db = require( '../../models/member-profile' )
const {hash_password, hash_compare} = require( '../../authentication' )


router.get('/', (req, res) => {
  res.status(200).render('pages/signup', {message:""})
})

router.post('/', (req, res) => {
  const {name, email, password, confirm_password} = req.body
  if( password !== confirm_password ) {
    res.status(200).render('pages/signup', { message: "the passwords do not match"} )
  }
  db.findUser( email )
    .then( oldMember => {
      if( oldMember ) {
        res.status(200).render('pages/signup', { message: "user already exists"} )
      } else {
        hash_password(password).then( hashedPassword => {
          db.createUser( name, email, hashedPassword )
            .then( member => {
              console.log("create a new member=======>", member )
              req.session.user = member
              res.redirect(`/profile/${member[0].id}`)
          })
        })
      }
    })
})

module.exports = router
