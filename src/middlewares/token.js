import jwt from "jsonwebtoken";

const signToken = (id, type) => {
  let secret;
  let validaty;
  switch (type) {
    case "access":
      secret = "Royalwhite......";
      validaty = "3m";
      break;
    case "refresh":
      secret = "testing.....";
      validaty = "1000d";
      break;
    default:
      throw new Error("Invalid Type");
  }
  return jwt.sign({ id }, secret, { expiresIn: validaty, issuer: "usman" });
};

(async () => {
  const accessToken = signToken("ooo", "access");
  const accessToken1 = signToken("ooo", "refresh");
  console.log(accessToken);
  console.log(accessToken1);
})();

export default signToken;
