import { Link } from "react-router-dom";

const ActionButton = ({ to, onClick, btnDescr, className }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex justify-center items-center cursor-pointer bg-blue-400 w-[100px] p-3 text-[16px] rounded-[12px] shadow-md
transition-all duration-200 hover:bg-blue-600 hover:shadow-lg active:scale-95
focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
    >
      {btnDescr}
    </Link>
  );
};

export default ActionButton;
