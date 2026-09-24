import { useState } from "react";

function ProductForm({
  initialData = {},
  onSubmit,
  loading,
  submitText,
}) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description:
      initialData.description || "",
    price: initialData.price || "",
    stock: initialData.stock || "",
    category: initialData.category || "",
    brand: initialData.brand || "",
  });

  const [errors, setErrors] =
    useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title =
        "Title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      newErrors.price =
        "Price must be 0 or greater.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      newErrors.stock =
        "Stock must be 0 or greater.";
    }

    if (!form.category.trim()) {
      newErrors.category =
        "Category is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  const fieldClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={fieldClass}
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className={fieldClass}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Price
          </label>

          <input
            type="number"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={fieldClass}
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-500">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Stock
          </label>

          <input
            type="number"
            min="0"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className={fieldClass}
          />

          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Category
          </label>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={fieldClass}
          />

          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Brand
          </label>

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : submitText}
      </button>
    </form>
  );
}

export default ProductForm;