const FormContainer = ({ children, className }) => {
  return (
    <div
      className={`bg-gray-900 p-2 rounded-2xl shadow-lg w-full max-w-md grid gap-6 relative ${className}`}
    >
      {children}
    </div>
  );
};

export default FormContainer;
