// models/interfaces/ApiResponse.js

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data - Los datos que se devuelven
 * @property {boolean} esExitoso - Indicador de éxito
 * @property {string} mensaje - Mensaje de la operación
 */

/**
 * Crea una respuesta API tipada.
 * @param {T} data 
 * @param {boolean} esExitoso 
 * @param {string} mensaje 
 * @returns {ApiResponse<T>}
 */
function createApiResponse(data, success, message) {
  return { data, success, message };
}
 
  module.exports = { createApiResponse };
  