const FormTextarea = ({ label, value, required, name, onChange, placeholder, error, ...props}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium">{label}
        {required && <span className="text-red-600 ml-1">*</span>}
        </label>}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full p-3 border rounded-lg bg-white outline-none 
                   focus:ring-2 focus:ring-blue-500"
      />
      {error && (
  <p className="text-red-600 text-sm mt-1">{error}</p>
)}
    </div>
  );
};

export default FormTextarea