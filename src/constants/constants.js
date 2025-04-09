// constants.js

module.exports = {
  ERROR_MESSAGES: {
    SERVER_ERROR: 'Hubo un problema al procesar la solicitud',
    VALIDATION_ERROR: 'Los datos proporcionados no son válidos',
    NOT_FOUND: 'El recurso solicitado no fue encontrado',
    CATEGORY_EXISTS: 'La categoría ya existe',
    NOT_FOUND: 'Categoría no encontrada',
    VALIDATION_ERROR: 'ID de categoría es requerido',
    PASSWORD_NOT_FOUND :'Contraseña no encontrada',
    USER_NOT_FOUND :'Usuario no encontrado',
    ESQUEMA_NOT_FOUND :'Esquema no valido',
    EMAIL_EXISTS :'El email ya existe',
    ERROR_SEND_EMAIL: 'Error al enviar el correo de confirmación',
    ACCESS_ERROR: 'Acceso denegado',
    TOKEN_NOT_FOUND:'Token no es válido'

  },
  SUCCESS_MESSAGES: {
    USER_SAVED : 'Usuario guardado con exito',
    OPERATION_SUCCESS: 'Operación completada con éxito',
    CATEGORY_SAVED: 'Categoría guardada exitosamente',
    CATEGORY_UPDATED: 'Categoría actualizada exitosamente',
    CATEGORY_DELETED: 'Categoría eliminada exitosamente',
    CATEGORY_FOUND: 'Categoría encontrada exitosamente',
    USER_DELETED :'Usuario Eliminado con exito'
  }
};
