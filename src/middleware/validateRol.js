const userSchema = require("../models/user");

const verifyRol = async(req, res, next) =>{
    const { id } = req.params;
    const rol = req.body.rol;
   
    if (!rol) return res.status(401).json({ error: 'Acceso denegado no existe un rol' })

    try {
        const user = await userSchema
          .findById({ _id: id })
          .then((data) => res.json(data))
        
        if(rol=== user.rol){
            next() // continuamos
        }
      
    } catch (error) {
        res.status(400).json({error: 'Este rol no tiene acceso a este servicio'})
    }
}

module.exports = verifyRol;