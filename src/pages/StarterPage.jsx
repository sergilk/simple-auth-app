import { ActionButton } from "@ui";

const StarterPage = () => {
  return (
    <div className="flex gap-3 justify-center bg-gray-900 rounded-[12px] p-10">
      <ActionButton to="/login" btnDescr="Log In" />
      <ActionButton to="/signup" btnDescr="Sign Up" />
    </div>
  );
};

export default StarterPage;
