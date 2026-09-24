import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

import {
  getProductById,
  updateProduct,
} from "../services/productApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data =
          await getProductById(id);

        setProduct(data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (updatedProduct) => {
    if (saving) return;

    try {
      setSaving(true);

      const updated =
        await updateProduct(
          id,
          updatedProduct
        );

      // DummyJSON does not persist updates.
      const updates = JSON.parse(
        localStorage.getItem(
          "productUpdates"
        ) || "{}"
      );

      updates[id] = {
        ...updated,
        _local: true,
      };

      localStorage.setItem(
        "productUpdates",
        JSON.stringify(updates)
      );

      navigate(`/products/${id}`);
    } catch (error) {
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          Loading...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          Product not found.
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to={`/products/${id}`}
          className="text-sm text-slate-600"
        >
          ← Back to Product
        </Link>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">
            Edit Product
          </h1>

          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            loading={saving}
            submitText="Save Changes"
          />
        </div>
      </main>
    </div>
  );
}

export default EditProduct;