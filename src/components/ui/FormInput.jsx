const FormInput = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled
}) => {
  return (
    <div className="bg-gray-800 p-2 rounded-[8px] w-full">
      <input
        name={name}
        maxLength={50}
        className="w-full rounded-[4px] border overflow-hidden text-[16px] text-gray-400  border-gray-600 outline-none p-2 placeholder:font-semibold placeholder:text-[14px] focus:outline-0 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
