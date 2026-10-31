import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getImageUrl = (image) => {
  if (!image) return "/images/default-product.png";
  const imgPath = Array.isArray(image) ? image[0] : image;
  if (!imgPath) return "/images/default-product.png";
  return imgPath.startsWith("/images") ? `${API_BASE_URL}${imgPath}` : imgPath;
};

export default api;

