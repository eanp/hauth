// meta
export const paginationQuery = "LIMIT @limit OFFSET @offset";
export const orderQuery = "ORDER BY ${order_value} ${}";
export const totalQuery = " SELECT COUNT(*) as total FROM";

// user
export const achiveChecker = "WHERE is_achieve=0";
export const inputUser = "INSERT INTO user (id, email, password, name, created_at, updated_at) VALUES (@id, @email, @password, @name, datetime('now'), datetime('now'))";
export const getUser = "SELECT id, email, password, name, created_at, updated_at FROM user";
export const getUserByEmail = "SELECT * FROM user WHERE email = ?";
export const searchUser = "WHERE (id LIKE @searchValue OR name LIKE  @searchValue OR email LIKE @searchValue) AND is_achieve=0";
export const updateUser = "";
export const deleteUser = "";