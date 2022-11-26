const isContractor = async (req, res, next) => {
  const { profile } = req;
  if (!profile || profile.type === "client") return res.status(401).end();
  next();
};
module.exports = { isContractor };
