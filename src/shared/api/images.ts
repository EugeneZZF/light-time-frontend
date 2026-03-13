import axios from "axios";

export const getImageById = async (id: string) => {
  try {
    const response = await axios.get(`/api/images/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch image with id ${id}: ${error}`);
  }
};
