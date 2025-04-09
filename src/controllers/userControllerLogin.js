const userSchema = require("../models/user");
const { createApiResponse } = require('../utils/ApiResponse.js');
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/constants');

// Validación de esquema para registrar un usuario
const schemaRegister = Joi.object({
  rol: Joi.string().min(3).max(255).required(),
  name: Joi.string().min(3).max(255).required(),
  lastName: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  phone: Joi.string().min(6).max(255).required(),
  city: Joi.string().min(3).max(255).required(),
  deparment: Joi.string().min(3).max(255).required(),
  address: Joi.string().min(3).max(255).required(),
  birthDate: Joi.date().required(),
  registrationDate: Joi.date().required(),
  password: Joi.string().min(6).max(1024).required(),
});
// Definición del esquema de validación para el login
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

// Función para enviar correo de registro
async function sendMail(email) {
  const CLIENTD_ID = process.env.CLIENTD_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const oAuth2Client = new google.auth.OAuth2(
    CLIENTD_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const accesToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: process.env.REACT_SERVICE,
      auth: {
        type: process.env.REACT_TYPE,
        user: process.env.REACT_USER,
        clientId: CLIENTD_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accesToken: accesToken,
      },
    });

    const mailOptions = {
      from: "<desideriumsex@gmail.com>",
      to: email,
      subject: "Bienvenido a Desiderium Sex Shop",
      html: `<b>Bienvenido a Desiderium Sex Shop, la mejor tienda erótica del país. Completa tu registro en el siguiente enlace:</b>
            <a href="https://www.desideriumsexshop.com">www.desideriumsexshop.com</a>`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log("ERROR", error);
    throw new Error("Error al enviar el correo electrónico");
  }
}

// Crear usuario
module.exports = {
  registerUser: async (req, res) => {
    // Validación del esquema para registrar un usuario
    const { error } = schemaRegister.validate(req.body);
    if (error) {
      return res.status(400).json(createApiResponse(null, false, error.details[0].message));
    }

    // Validación si el email ya existe
    const emailExiste = await userSchema.findOne({ email: req.body.email });
    if (emailExiste) {
      return res.status(400).json(createApiResponse(null, false, ERROR_MESSAGES.EMAIL_EXISTS));
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Crear nuevo usuario
    const user = new userSchema({
      rol: req.body.rol,
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      deparment: req.body.deparment,
      address: req.body.address,
      birthDate: req.body.birthDate,
      state: 1,
      registrationDate: req.body.registrationDate,
      cart: [], // Inicializar carrito vacío
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    try {
      const savedUser = await user.save();

      // // Enviar correo de registro
      // try {
      //   await sendMail(req.body.email);
      //   return res.status(200).json(createApiResponse(savedUser, true, SUCCESS_MESSAGES.USER_SAVED));
      // } catch (error) {
      //   return res.status(500).json(createApiResponse(null, false, ERROR_MESSAGES.ERROR_SEND_EMAIL));
      // }
    } catch (error) {
      return res.status(500).json(createApiResponse(null, false, ERROR_MESSAGES.SERVER_ERROR));
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Buscar todos los usuarios en la base de datos
      const users = await userSchema.find();

      // Verificar si hay usuarios
      if (users.length === 0) {
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.NOT_FOUND // "No se encontraron usuarios"
        ));
      }

      // Enviar respuesta con la lista de usuarios
      return res.status(200).json(createApiResponse(
        users,
        true,
        SUCCESS_MESSAGES.OPERATION_SUCCESS // "Operación exitosa"
      ));

    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      // Manejo de error en caso de fallo en el servidor
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.SERVER_ERROR // "Error del servidor"
      ));
    }
  },

  loginUser: async (req, res) => {
    // validacion del esquema para registrar un usuario
    const { error } = schemaLogin.validate(req.body);
    if (error) {
      return res.status(400).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ESQUEMA_NOT_FOUND
      ));
    }

    const userr = await userSchema.findOne({ email: req.body.email });
    if (!userr) return res.status(400).json(createApiResponse(
      null,
      false,
      ERROR_MESSAGES.USER_NOT_FOUND
    ));

    const validPassword = await bcrypt.compare(
      req.body.password,
      userr.password
    );
    if (!validPassword)
      return res.status(400).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.PASSWORD_NOT_FOUND
      ));

    // create token
    const token = jwt.sign(
      {
        id: userr._id,
        rol: userr.rol,
        name: userr.name,
        lastName: userr.lastName,
        email: userr.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: 60 * 60 * 24 }
    );
    return res.status(200).json(createApiResponse(
      token,
      true,
      SUCCESS_MESSAGES.OPERATION_SUCCESS
    ));
  },
  deleteUser : async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Buscar y eliminar el usuario por ID
      const deletedUser = await userSchema.findByIdAndDelete(userId);
  
      // Verificar si el usuario existía
      if (!deletedUser) {
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.USER_NOT_FOUND // "Usuario no encontrado"
        ));
      }
  
      // Enviar respuesta de éxito
      return res.status(200).json(createApiResponse(
        deletedUser,
        true,
        SUCCESS_MESSAGES.USER_DELETED // "Usuario eliminado con éxito"
      ));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.SERVER_ERROR // "Error del servidor"
      ));
  }
},
updateUser : async (req, res) => {
  // Validar el esquema de actualización (puedes ajustar según los campos que desees permitir actualizar)
  const schemaUpdate = Joi.object({
    rol: Joi.string().min(3).max(255),
    name: Joi.string().min(3).max(255),
    lastName: Joi.string().min(3).max(255),
    email: Joi.string().min(6).max(255).email(),
    phone: Joi.string().min(6).max(255),
    city: Joi.string().min(3).max(255),
    deparment: Joi.string().min(3).max(255),
    modifyDate: Joi.date(),
    address: Joi.string().min(3).max(255),
    birthDate: Joi.date(),
    password: Joi.string().min(6).max(1024),
    state: Joi.number().integer().min(0), // Asegurando que sea un número entero no negativo
    cart: Joi.array().items(Joi.object({
        // Define la estructura de los elementos del carrito aquí si es necesario
        productId: Joi.string(),
        quantity: Joi.number().integer().min(1)
    })).allow(null) 
});


  const { error } = schemaUpdate.validate(req.body);
  if (error) {
    return res.status(400).json(createApiResponse(null, false, error.details[0].message));
  }

  try {
    const userId = req.params.id;
    const updates = req.body;

    // Si hay una contraseña, encriptarla
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Buscar y actualizar el usuario por ID
    const updatedUser = await userSchema.findByIdAndUpdate(userId, updates, { new: true });

    // Verificar si el usuario existía
    if (!updatedUser) {
      return res.status(404).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.USER_NOT_FOUND // "Usuario no encontrado"
      ));
    }

    // Enviar respuesta de éxito
    return res.status(200).json(createApiResponse(
      updatedUser,
      true,
      SUCCESS_MESSAGES.USER_UPDATED // "Usuario actualizado con éxito"
    ));
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json(createApiResponse(
      null,
      false,
      ERROR_MESSAGES.SERVER_ERROR // "Error del servidor"
    ));
  }
}
};
