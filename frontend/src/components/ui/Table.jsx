import { useEffect } from "react";
import { ACTIVE_STATUS, ORDER_STATUS } from "../../config/app";

const Table = ({
  data = [{ title: "banner" }],
  columns,
  actions,
  keyId,
  type = "",
  onStatusChange,
}) => {
  const STATUS_OPTIONS =
    type === "orders" ? ORDER_STATUS : type === "status" ? ACTIVE_STATUS : "";
  console.log("data in table", data);

  const resolveImageUrl = (image, baseUrl = "http://localhost:5001") => {
    if (!image) return "";

    // Case 1: S3 or Cloudinary object
    if (typeof image === "object" && image.url) {
      // If already absolute (S3), return as-is
      console.log('new img', image.url);
      
      return image.url.startsWith("http")
        ? image.url
        : `${baseUrl}${image.url}`
    }

    // Case 2: Old string path
    if (typeof image === "string") {
      console.log('old img', image);
      return image.startsWith("http") ? image : `${baseUrl}${image}` ?? `${baseUrl}${image.url}`;
    }

    return "";
  };

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

      <tbody>
        {data?.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50 ">
            {columns.map((col) => (
              <td key={col} className="px-4 py-2 border border-gray-200 ">
                {col === "order Status" || col === "status" ? (
                  <select
                    value={item.orderStatus ?? item.status}
                    onChange={(e) => onStatusChange?.(item._id, e.target.value)}
                    className="rounded px-2 py-1 text-sm"
                  >
                    {STATUS_OPTIONS?.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : col === "images" || col === "image" ? (
                  <img
                    width={70}
                    height={70}
                    src={resolveImageUrl(
                      col === "images" ? item[col]?.[0] : item[col] || item[col]?.[0]
                    )}
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
                    onClick={() => actions.onEdit(item)}
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

export default Table;
