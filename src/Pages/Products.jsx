import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "../services/productApi";

function Products() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const abortControllerRef = useRef(null);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [searchInput, setSearchInput] =
    useState(search);

  const rawPage =
    parseInt(searchParams.get("page")) || 1;

  const page = Math.max(1, rawPage);

  const requestedLimit =
    parseInt(searchParams.get("limit")) || 20;

  const limit = [10, 20, 50].includes(
    requestedLimit
  )
    ? requestedLimit
    : 20;

  const skip = (page - 1) * limit;

  const getSortParams = () => {
    if (!sort) {
      return {};
    }

    const allowed = [
      "price-asc",
      "price-desc",
      "rating-asc",
      "rating-desc",
      "title-asc",
      "title-desc",
    ];

    if (!allowed.includes(sort)) {
      return {};
    }

    const [sortBy, order] = sort.split("-");

    return {
      sortBy,
      order,
    };
  };

  const fetchProducts = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const sortParams = getSortParams();

      let data;

      if (search.trim()) {
        data = await searchProducts(
          search.trim(),
          {
            limit,
            skip,
            ...sortParams,
          },
          controller.signal
        );
      } else if (category) {
        data = await getProductsByCategory(
          category,
          {
            limit,
            skip,
            ...sortParams,
          },
          controller.signal
        );
      } else {
        data = await getProducts(
          {
            limit,
            skip,
            ...sortParams,
          },
          controller.signal
        );
      }

      if (controller.signal.aborted) {
        return;
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
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

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        const params = new URLSearchParams(
          searchParams
        );

        if (searchInput.trim()) {
          params.set(
            "search",
            searchInput.trim()
          );

          // Search and category are not combined.
          params.delete("category");
        } else {
          params.delete("search");
        }

        params.set("page", "1");

        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const data = await getCategories();

      setCategories(data || []);
    } catch (error) {
      console.error(
        "Failed to load categories",
        error
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [
    page,
    limit,
    search,
    category,
    sort,
  ]);

  // Validate URL page after total is known
  useEffect(() => {
    const totalPages = Math.ceil(total / limit);

    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      const params = new URLSearchParams(
        searchParams
      );

      params.set(
        "page",
        String(totalPages)
      );

      setSearchParams(params, {
        replace: true,
      });
    }
  }, [total, limit, page]);

  const updateParam = (
    key,
    value,
    resetPage = true
  ) => {
    const params = new URLSearchParams(
      searchParams
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (resetPage) {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / limit);

  const start =
    total === 0 ? 0 : skip + 1;

  const end = Math.min(
    skip + limit,
    total
  );

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-slate-500">
            Loading products...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6">

<div className="mb-6 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold text-slate-900">
      Products
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Manage your products
    </p>
  </div>

  <button
    onClick={() => navigate("/products/add")}
    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
  >
    + Add Product
  </button>
</div>

        {/* Controls */}
        <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
            />

            <Filters
              category={category}
              categories={categories}
              sort={sort}
              pageSize={String(limit)}
              searchActive={Boolean(search)}
              onCategoryChange={(value) => {
                updateParam(
                  "category",
                  value
                );
              }}
              onSortChange={(value) => {
                updateParam(
                  "sort",
                  value
                );
              }}
              onPageSizeChange={(value) => {
                updateParam(
                  "limit",
                  value
                );
              }}
            />

          </div>

          {search && (
            <p className="mt-3 text-sm text-slate-500">
              Searching for:{" "}
              <span className="font-medium text-slate-900">
                {search}
              </span>
            </p>
          )}

          {category && !search && (
            <p className="mt-3 text-sm text-slate-500">
              Category:{" "}
              <span className="font-medium text-slate-900">
                {category}
              </span>
            </p>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <ProductTable
              products={products}
            />

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination info */}
            <div className="mt-4 text-sm text-slate-500">
              Showing {start}–{end} of{" "}
              {total}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) =>
                updateParam(
                  "page",
                  String(newPage),
                  false
                )
              }
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Products;