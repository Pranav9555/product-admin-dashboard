import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { addProduct } from "../services/productApi";

import {
  getLocalProducts,
  saveLocalProducts,
} from "../utils/productStorage";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (product) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const created = await addProduct(product);

      const localProducts = getLocalProducts();

      const localProduct = {
        ...created,
        ...product,
        _local: true,
      };

      saveLocalProducts([
        ...localProducts,
        localProduct,
      ]);

      navigate(`/products/${created.id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/products"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Products
        </Link>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">
            Add Product
          </h1>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <ProductForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Add Product"
          />
        </div>
      </main>
    </div>
  );
}

export default AddProduct;