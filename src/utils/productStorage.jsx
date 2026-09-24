const LOCAL_PRODUCTS_KEY = "localProducts";
const PRODUCT_UPDATES_KEY = "productUpdates";
const DELETED_PRODUCTS_KEY = "deletedProductIds";

export const getLocalProducts = () => {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_PRODUCTS_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

export const saveLocalProducts = (products) => {
  localStorage.setItem(
    LOCAL_PRODUCTS_KEY,
    JSON.stringify(products)
  );
};

export const getProductUpdates = () => {
  try {
    return JSON.parse(
      localStorage.getItem(PRODUCT_UPDATES_KEY) || "{}"
    );
  } catch {
    return {};
  }
};

export const saveProductUpdate = (id, product) => {
  const updates = getProductUpdates();

  updates[String(id)] = {
    ...product,
    _local: true,
  };

  localStorage.setItem(
    PRODUCT_UPDATES_KEY,
    JSON.stringify(updates)
  );
};

export const getProductOverride = (id) => {
  const updates = getProductUpdates();

  return updates[String(id)] || null;
};

export const getDeletedProductIds = () => {
  try {
    return JSON.parse(
      localStorage.getItem(DELETED_PRODUCTS_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

export const markProductDeleted = (id) => {
  const deletedIds = getDeletedProductIds();

  const idString = String(id);

  if (!deletedIds.includes(idString)) {
    deletedIds.push(idString);
  }

  localStorage.setItem(
    DELETED_PRODUCTS_KEY,
    JSON.stringify(deletedIds)
  );
};

export const isProductDeleted = (id) => {
  return getDeletedProductIds().includes(String(id));
};

export const removeLocalProduct = (id) => {
  const products = getLocalProducts();

  const filteredProducts = products.filter(
    (product) => String(product.id) !== String(id)
  );

  saveLocalProducts(filteredProducts);
};

export const updateLocalProduct = (
  id,
  updatedProduct
) => {
  const products = getLocalProducts();

  const updatedProducts = products.map(
    (product) =>
      String(product.id) === String(id)
        ? {
            ...product,
            ...updatedProduct,
            _local: true,
          }
        : product
  );

  saveLocalProducts(updatedProducts);
};

export const getLocalProductById = (id) => {
  const products = getLocalProducts();

  return (
    products.find(
      (product) =>
        String(product.id) === String(id)
    ) || null
  );
};