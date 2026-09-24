import api from "./axios";

export const getProducts = async (params = {}, signal) => {
  const response = await api.get("/products", {
    params,
    signal,
  });

  return response.data;
};

export const searchProducts = async (
  query,
  params = {},
  signal
) => {
  const response = await api.get("/products/search", {
    params: {
      q: query,
      ...params,
    },
    signal,
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProductsByCategory = async (
  category,
  params = {},
  signal
) => {
  const response = await api.get(
    `/products/category/${category}`,
    {
      params,
      signal,
    }
  );

  return response.data;
};

export const getProductById = async (id, signal) => {
  const response = await api.get(`/products/${id}`, {
    signal,
  });

  return response.data;
};

export const addProduct = async (product) => {
  const response = await api.post("/products/add", product);

  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(
    `/products/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};