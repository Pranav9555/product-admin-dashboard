import { useNavigate } from "react-router-dom";

function ProductTable({ products }) {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
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
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() =>
                  navigate(`/products/${product.id}`)
                }
                className="cursor-pointer hover:bg-slate-50"
              >
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;