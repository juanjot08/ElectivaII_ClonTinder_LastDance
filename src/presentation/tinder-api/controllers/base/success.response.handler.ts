import { Response } from 'express';
import { SuccessResponse } from './api.response.interface';
import { StatusCodes, getReasonPhrase } from 'http-status-codes'; // Importa desde la librería

/**
 * Envía una respuesta exitosa estandarizada.
 * @param res Objeto Response de Express.
 * @param statusCode Código de estado HTTP (ej: 200, 201).
 * @param data Datos a enviar en la respuesta.
 * @param message Mensaje descriptivo opcional.
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: StatusCodes,
  data: T,
  message?: string
): void => {
  const responseBody: SuccessResponse<T> = {
    success: true,
    // Puedes incluir el mensaje estándar si no proporcionas uno específico
    message: message || getReasonPhrase(statusCode),
    data: data,
  };
  res.status(statusCode).json(responseBody);
};