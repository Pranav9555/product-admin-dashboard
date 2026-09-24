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

import {
  getLocalProductById,
  getProductOverride,
  saveProductUpdate,
} from "../utils/productStorage";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const localProduct =
          getLocalProductById(id);

        if (localProduct) {
          setProduct(localProduct);
          return;
        }

        const data = await getProductById(id);

        const localOverride =
          getProductOverride(id);

        setProduct(
          localOverride
            ? {
                ...data,
                ...localOverride,
              }
            : data
        );
      } catch (error) {
        setError("Product not found.");
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
      setError("");

      const updated = await updateProduct(
        id,
        updatedProduct
      );

      saveProductUpdate(id, {
        ...updated,
        ...updatedProduct,
      });

      navigate(`/products/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-slate-500">
            Loading product...
          </p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold">
            Product Not Found
          </h2>

          <p className="text-slate-500">
            {error || "The product does not exist."}
          </p>

          <Link
            to="/products"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Back to Products
          </Link>
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
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Product
        </Link>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">
            Edit Product
          </h1>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

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