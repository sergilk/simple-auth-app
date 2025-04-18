const AppContainer = ({ children, className }) => {
  return (
    <div
      className={`grid relative justify-items-center p-5 items-center min-h-[100vh] bg-gray-950 text-amber-50 font-bold text-[18px] font-display ${className}`}
    >
      {children}
    </div>
  );
};

export default AppContainer;
