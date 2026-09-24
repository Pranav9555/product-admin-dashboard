import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  searchProducts,
} from "../services/productApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const abortControllerRef = useRef(null);

  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const page = Math.max(
    1,
    parseInt(searchParams.get("page")) || 1
  );

  const limit = [10, 20, 50].includes(
    parseInt(searchParams.get("limit"))
  )
    ? parseInt(searchParams.get("limit"))
    : 20;

  const skip = (page - 1) * limit;

  // Fetch products
  const fetchProducts = async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      let data;

      if (search.trim()) {
        data = await searchProducts(
          search.trim(),
          {
            limit,
            skip,
          },
          controller.signal
        );
      } else {
        data = await getProducts({
          limit,
          skip,
        });
      }

      // Don't update state if request was cancelled
      if (controller.signal.aborted) {
        return;
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      if (
        error.name === "CanceledError" ||
        error.name === "AbortError"
      ) {
        return;
      }

      setError("Failed to load products.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        const params = new URLSearchParams(searchParams);

        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }

        // Search always starts from page 1
        params.set("page", "1");

        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch whenever page, limit, or search changes
  useEffect(() => {
    fetchProducts();
  }, [page, limit, search]);

  // Pagination calculations
  const totalPages = Math.ceil(total / limit);

  const start = total === 0 ? 0 : skip + 1;

  const end = Math.min(skip + limit, total);

  // Change page while preserving search
  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", newPage);
    params.set("limit", limit);

    setSearchParams(params);
  };

  // Change page size while preserving search
  const changeLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    params.set("limit", newLimit);

    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">
          Loading products...
        </p>
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">
            Product Admin
          </h1>

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

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6">

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your products
          </p>
        </div>

        {/* Search + Page Size */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-500 md:max-w-md"
          />

          {/* Page Size */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">
              Page Size:
            </label>

            <select
              value={limit}
              onChange={(e) =>
                changeLimit(e.target.value)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">

              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Image
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Title
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Category
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Price
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Rating
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold">
                    Stock
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>

                      <td className="px-4 py-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {product.title}
                      </td>

                      <td className="px-4 py-3 capitalize text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-4 py-3">
                        ${product.price}
                      </td>

                      <td className="px-4 py-3">
                        ⭐ {product.rating}
                      </td>

                      <td className="px-4 py-3">
                        {product.stock}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-slate-500">
          Showing {start}–{end} of {total}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-wrap items-center gap-2">

          <button
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
            className="rounded border bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          )
            .slice(0, 10)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => changePage(pageNumber)}
                className={`rounded px-3 py-2 ${
                  page === pageNumber
                    ? "bg-slate-900 text-white"
                    : "border bg-white"
                }`}
              >
                {pageNumber}
              </button>
            ))}

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => changePage(page + 1)}
            className="rounded border bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </main>
    </div>
  );
}

export default Products;