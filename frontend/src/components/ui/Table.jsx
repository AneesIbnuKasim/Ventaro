import { useEffect } from "react";
import { ORDER_STATUS } from "../../config/app";

const Table = ({ data, columns, actions, keyId, type='' , onStatusChange}) => {

  const STATUS_OPTIONS = type === 'orders' ? ORDER_STATUS : null

  useEffect(() => {
    console.log('data orders',data);
    
  }, [data])

  return (
    <table className="w-full border bg-white border-gray-300 text-left rounded-xl">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col) => (
            <th
              key={col._id}
              className="px-4 py-2 border border-gray-300 font-medium"
            >
              {col.toUpperCase()}
            </th>
          ))}

          {actions && (
            <th className="px-4 py-2 border border-gray-300 font-medium">
              ACTIONS
            </th>
          )}
        </tr>
      </thead>

      <tbody >
        {data?.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50 ">
            {columns.map((col) => (
              <td key={col} className="px-4 py-2 border border-gray-200 ">
                {col === "order Status" ? (
                  <select
                    value={item.orderStatus}
                    onChange={(e) =>
                      onStatusChange?.(item._id, e.target.value)
                    }
                    className=" rounded px-2 py-1 text-sm"
                  >
                    {STATUS_OPTIONS?.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : col === "images" ? (
                  <img
                    width={70}
                    height={70}
                    src={`http://localhost:5001${item[col][0]}`}
                  />
                ) : (
                  item[col.replace(" ", "")] ?? "---"
                )}
              </td>
            ))}

            {actions && (
              <td className="px-4 py-2 border border-gray-300 space-x-2">
                {actions.onEdit && (
                  <button
                    onClick={() => (actions.onEdit(item))}
                    className="px-2 py-1 text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                )}

                {actions.onDelete && (
                  <button
                    onClick={() => actions.onDelete(item)}
                    className="px-2 py-1 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}

                {actions.onView && (
                  <button
                    onClick={() => actions.onView(item)}
                    className="px-2 py-1 text-green-600 hover:underline"
                  >
                    View
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table