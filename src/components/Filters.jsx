function Filters({
  category,
  categories,
  sort,
  pageSize,
  onCategoryChange,
  onSortChange,
  onPageSizeChange,
  searchActive,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={category}
        disabled={searchActive}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="">All Categories</option>

        {categories.map((item) => {
          const value =
            typeof item === "string"
              ? item
              : item.slug;

          const label =
            typeof item === "string"
              ? item
              : item.name;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2"
      >
        <option value="">Sort By</option>
        <option value="price-asc">
          Price: Low to High
        </option>
        <option value="price-desc">
          Price: High to Low
        </option>
        <option value="rating-asc">
          Rating: Low to High
        </option>
        <option value="rating-desc">
          Rating: High to Low
        </option>
        <option value="title-asc">
          Title: A to Z
        </option>
        <option value="title-desc">
          Title: Z to A
        </option>
      </select>

      <select
        value={pageSize}
        onChange={(e) =>
          onPageSizeChange(e.target.value)
        }
        className="rounded-lg border border-slate-300 bg-white px-3 py-2"
      >
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
        <option value="50">50 / page</option>
      </select>
    </div>
  );
}

export default Filters;