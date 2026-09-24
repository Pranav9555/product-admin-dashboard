import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/products/${product.id}`)
      }
      className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm hover:shadow-md md:hidden"
    >
      <div className="flex gap-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-20 w-20 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">
            {product.title}
          </h3>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {product.category}
          </p>

          <p className="mt-2 font-semibold">
            ${product.price}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t pt-3 text-sm text-slate-600">
        <span>⭐ {product.rating}</span>
        <span>Stock: {product.stock}</span>
      </div>
    </div>
  );
}

export default ProductCard;