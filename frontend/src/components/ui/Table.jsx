const Table = ({ data, columns, actions }) => {

  console.log('data', data)

  return (
    <table className="w-full border bg-white border-gray-300 text-left">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col) => (
            <th
              key={col}
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
          <tr key={item._id} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td
                key={col}
                className="px-4 py-2 border border-gray-300"
              >
                {item[col] ?? "---"}
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