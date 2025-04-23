export const removeSpaceSymbols = value => {
  return value.replace(/\s/g, "");
};

export const formattedDate = new Intl.DateTimeFormat(navigator.language, {
  dateStyle: "medium",
  timeStyle: "medium"
}).format(new Date());

export const extractToken = req => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

export const getDataFromInput = (e, setData) => {
  const { name: inputName, value } = e.target;

  return setData(prev => ({
    ...prev,
    [inputName]: removeSpaceSymbols(value)
  }));
};
