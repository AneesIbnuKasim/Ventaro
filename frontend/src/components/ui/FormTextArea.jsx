const FormTextarea = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium">{label}</label>}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full p-3 border rounded-lg bg-white outline-none 
                   focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FormTextarea