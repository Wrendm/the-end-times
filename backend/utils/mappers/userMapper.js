const mapUser = (user) => {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    roles: user.roles,
  };
};

module.exports = { mapUser };