import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);

  const limit = [10, 20, 50].includes(parseInt(searchParams.get("limit")))
    ? parseInt(searchParams.get("limit"))
    : 20;

  const skip = (page - 1) * limit;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        limit,
        skip,
      });

      setTotal(data.total);

      setProducts(data.products);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={fetchProducts}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  const start = total === 0 ? 0 : skip + 1;

  const end = Math.min(skip + limit, total);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Product Admin</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>

          <p className="mt-1 text-sm text-slate-500">Manage your products</p>
        </div>
<div className="mb-4 flex items-center gap-4">
  <div>
    <label className="mr-2 text-sm">Page Size:</label>

    <select
      value={limit}
      onChange={(e) => {
        setSearchParams({
          page: 1,
          limit: e.target.value,
        });
      }}
      className="rounded border px-3 py-2"
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
  </div>
</div>
<div className="mt-4 flex items-center gap-2">
  <button
    disabled={page === 1}
    onClick={() => {
      setSearchParams({
        page: page - 1,
        limit,
      });
    }}
    className="rounded border px-3 py-2 disabled:opacity-50"
  >
    Previous
  </button>

  {[...Array(totalPages)].slice(0, 10).map((_, index) => (
    <button
      key={index}
      onClick={() => {
        setSearchParams({
          page: index + 1,
          limit,
        });
      }}
      className={`rounded px-3 py-2 ${
        page === index + 1
          ? "bg-slate-900 text-white"
          : "border"
      }`}
    >
      {index + 1}
    </button>
  ))}

  <button
    disabled={page === totalPages}
    onClick={() => {
      setSearchParams({
        page: page + 1,
        limit,
      });
    }}
    className="rounded border px-3 py-2 disabled:opacity-50"
  >
    Next
  </button>
</div>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">Image</th>

                  <th className="px-4 py-3 text-sm font-semibold">Title</th>

                  <th className="px-4 py-3 text-sm font-semibold">Category</th>

                  <th className="px-4 py-3 text-sm font-semibold">Price</th>

                  <th className="px-4 py-3 text-sm font-semibold">Rating</th>

                  <th className="px-4 py-3 text-sm font-semibold">Stock</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>

                    <td className="px-4 py-3 font-medium">{product.title}</td>

                    <td className="px-4 py-3 capitalize text-slate-600">
                      {product.category}
                    </td>

                    <td className="px-4 py-3">${product.price}</td>

                    <td className="px-4 py-3">⭐ {product.rating}</td>

                    <td className="px-4 py-3">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500">
  Showing {start}–{end} of {total}
</div>
      </main>
    </div>
  );
}

export default Products;
