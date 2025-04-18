const RevealPassword = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      className="absolute right-4 bottom-0 transform -translate-y-[60%] cursor-pointer text-gray-400 hover:text-white"
      title="Reveal password"
    >
      👁️
    </span>
  );
};

export default RevealPassword;
