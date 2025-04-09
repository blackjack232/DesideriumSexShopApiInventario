
const userSchema = require("../models/user");




// create user
module.exports = {
  createUser: async (req, res) => {

    const user = await userSchema(req.body);
    user
      .save()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  },
  getAllUsers: async (req, res) => {
    await userSchema
      .find()
      .exec((error, user) => {
        res.json(user)
      })
  },
  updateComprasUser: async (req, res) => {

    const { id } = req.params;
    const { producto } = req.body;
    await userSchema
      .updateOne({ _id: id }, { $set: { producto } })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));

  },
  getUser: async (req, res) => {

    const { id } = req.params;
    await userSchema
      .findById({ _id: id })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));

  }

  // // get all users
  // router.get("/users", async (req, res) => {
  //   await userSchema
  //     .find()
  //     .exec((error,user)=>{
  //       res.json(user)
  //     })
  // });

  // // get a user
  // router.get("/users/:id",async (req, res) => {
  //   const { id } = req.params;
  //   await userSchema
  //     .findById(id)
  //     .then((data) => res.json(data))
  //     .catch((error) => res.json({ message: error }));
  // });

  // // delete a user
  // router.delete("/users/:id", async (req, res) => {
  //   const { id } = req.params;
  //   await userSchema
  //     .remove({ _id: id })
  //     .then((data) => res.json(data))
  //     .catch((error) => res.json({ message: error }));
  // });

  // // update a user
  // router.put("/users/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const { name, age, email } = req.body;
  //   await userSchema
  //     .updateOne({ _id: id }, { $set: { name, age, email } })
  //     .then((data) => res.json(data))
  //     .catch((error) => res.json({ message: error }));
  // });
  // // update compra
  // router.put("/user/compra/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const {compra} = req.body;
  //   await userSchema
  //     .findByIdAndUpdate({ _id: id }, { $push: { listCompras:compra } })
  //     .then((data) => res.json(data))
  //     .catch((error) => res.json({ message: error }));
  // });

}

