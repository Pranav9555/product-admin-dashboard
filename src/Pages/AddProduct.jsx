import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { addProduct } from "../services/productApi";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (product) => {
    if (loading) return;

    try {
      setLoading(true);

      const created =
        await addProduct(product);

      // DummyJSON doesn't permanently save this.
      // Keep the created product locally for demo.
      const localProducts = JSON.parse(
        localStorage.getItem(
          "localProducts"
        ) || "[]"
      );

      localStorage.setItem(
        "localProducts",
        JSON.stringify([
          ...localProducts,
          {
            ...created,
            _local: true,
          },
        ])
      );

      navigate(`/products/${created.id}`);
    } catch (error) {
      alert("Failed to add product.");
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
          className="text-sm text-slate-600"
        >
          ← Back to Products
        </Link>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">
            Add Product
          </h1>

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