import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getProductById,
  deleteProduct,
} from "../services/productApi";

import {
  getLocalProductById,
  getProductOverride,
  markProductDeleted,
  removeLocalProduct,
  isProductDeleted,
} from "../utils/productStorage";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if product was deleted locally
        if (isProductDeleted(id)) {
          setError("Product not found.");
          return;
        }

        // First check locally created product
        const localProduct =
          getLocalProductById(id);

        if (localProduct) {
          setProduct(localProduct);
          return;
        }

        // Otherwise get product from API
        const data = await getProductById(id);

        // Check if product has local edits
        const override =
          getProductOverride(id);

        if (override) {
          setProduct({
            ...data,
            ...override,
          });
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      /*
        Try deleting from API.
        DummyJSON mutations are simulated,
        so local deletion is also required.
      */
      try {
        await deleteProduct(id);
      } catch (apiError) {
        console.warn(
          "API delete failed. Applying local delete.",
          apiError
        );
      }

      // Remove from local products if it was locally created
      removeLocalProduct(id);

      // Mark server product as deleted locally
      markProductDeleted(id);

      // Go back to products
      navigate("/products", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      setError("Failed to delete product.");
      setDeleting(false);
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

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/products"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Products
        </Link>

        <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Images */}
            <div>
              <img
                src={
                  product.images?.[0] ||
                  product.thumbnail
                }
                alt={product.title}
                className="h-80 w-full rounded-xl bg-slate-50 object-contain"
              />

              <div className="mt-4 flex gap-3 overflow-x-auto">
                {(product.images || []).map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-16 w-16 rounded-lg border object-cover"
                    />
                  )
                )}
              </div>
            </div>

            {/* Product information */}
            <div>
              <p className="text-sm capitalize text-slate-500">
                {product.category}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {product.title}
              </h1>

              <p className="mt-4 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-2xl font-bold">
                  ${product.price}
                </p>

                <p>
                  ⭐ {product.rating || "N/A"}
                </p>

                <p>
                  Stock: {product.stock}
                </p>

                <p>
                  Brand:{" "}
                  {product.brand || "N/A"}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800"
                >
                  Edit Product
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Product"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold">
              Reviews
            </h2>

            <div className="mt-4 space-y-4">
              {product.reviews?.length ? (
                product.reviews.map(
                  (review, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-slate-50 p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <p className="font-medium">
                          {review.reviewerName ||
                            review.reviewerEmail ||
                            "Customer"}
                        </p>

                        <span>
                          ⭐ {review.rating}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {review.comment}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No reviews available.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;