const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/constants');
const { createApiResponse } = require('../utils/ApiResponse');

const verifyToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json(createApiResponse(null, false, ERROR_MESSAGES.ACCESS_ERROR));

    // El token viene en el formato 'Bearer <token>'
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; // Añadimos el usuario verificado al objeto req
        next(); // Continuamos con la siguiente función de middleware
    } catch (error) {
        res.status(400).json(createApiResponse(null, false, ERROR_MESSAGES.TOKEN_NOT_FOUND));
    }
};

module.exports = verifyToken;
