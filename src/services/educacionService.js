import axios from 'axios';

const API_URL = 'http://localhost:4001/api/educacion';

export const obtenerEducacion = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener educación:', error);
    return [];
  }
};
