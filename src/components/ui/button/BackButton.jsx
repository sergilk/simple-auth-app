import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const BackButton = ({ to }) => {
  return (
    <Link
      to={to}
      className="absolute top-[-30px] flex items-center gap-1 left-0 cursor-pointer hover:text-blue-400"
    >
      <FaArrowAltCircleLeft /> back
    </Link>
  );
};

export default BackButton;
