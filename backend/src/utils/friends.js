export function buildPairKey(userIdA, userIdB) {
  return [String(userIdA), String(userIdB)].sort().join(':');
}

export function toUserPreview(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id),
    email: user.email,
    username: user.username || null,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
  };
}
