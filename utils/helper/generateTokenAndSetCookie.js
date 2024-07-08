import jwt from "jsonwebtoken";

const generatTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
  });
  return token;
};

export default generatTokenAndSetCookie;
