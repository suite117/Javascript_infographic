package db;

import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import model.User;

public class UserDAO extends DAO<User, Integer> {

	public UserDAO(Class<User> objectClass) {
		super(objectClass);
	}

	@Override
	public void create() throws SQLException {

		try {
			openConnection();

			String createString;
			createString = "create table " + tableName + " (" + "ID INT, "
					+ "USERNAME VARCHAR(30), " + "EMAIL VARCHAR(30), " + ")";

			Statement stmt;

			stmt = getConnection().createStatement();
			stmt.executeUpdate(createString);

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}

	@Override
	public void add(User objectBean) throws SQLException {
		try {
			openConnection();

			String querystring = "INSERT INTO " + tableName
					+ " VALUES(?,?,?,?)";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, objectBean.getId());
			ptmt.setString(2, objectBean.getUsername());
			ptmt.setString(3, objectBean.getPassword());
			ptmt.setString(4, objectBean.getEmail());
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}

	@Override
	public void update(User objectBean) throws SQLException {
		try {
			openConnection();

			String querystring = "UPDATE " + tableName + " SET "
					+ "ID=?,USERNAME=?," + "PASSWORD=?,EMAIL=? WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, objectBean.getId());
			ptmt.setString(2, objectBean.getUsername());
			ptmt.setString(3, objectBean.getPassword());
			ptmt.setString(4, objectBean.getEmail());
			ptmt.setInt(5, objectBean.getId());
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}
	}

	@Override
	public void delete(Integer id) throws SQLException {
		String querystring = "DELETE FROM " + tableName + " WHERE ID=?";

		try {
			openConnection();

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, id);
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}

	@Override
	public List<User> findAll() throws SQLException, Exception {
		List<User> users = new ArrayList<User>();
		User user = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				user = new User();
				user.setId(rs.getInt(1));
				user.setUsername(rs.getString(2));
				user.setPassword(rs.getString(3));
				user.setEmail(rs.getString(4));

				users.add(user);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return users;
	}

	@Override
	public Map<Integer, User> findAllMap() throws SQLException, Exception {
		Map<Integer, User> users = new HashMap<Integer, User>();
		User user = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				user = new User();
				user.setId(rs.getInt(1));
				user.setUsername(rs.getString(2));
				user.setPassword(rs.getString(3));
				user.setEmail(rs.getString(4));

				users.put(user.getId(), user);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			closeConnection();
		}

		return users;
	}

	@Override
	public User findByPrimaryKey(Integer id) throws Exception {

		if (id == null)
			throw new Exception("Id value:" + id);

		User user = null;
		try {
			openConnection();

			String querystring = "SELECT * FROM " + tableName + " WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setObject(1, id);
			rs = ptmt.executeQuery();

			if (rs.next()) {
				user = new User();
				user.setId(rs.getInt(1));
				user.setUsername(rs.getString(2));
				user.setPassword(rs.getString(3));
				user.setEmail(rs.getString(4));
			} else {
				throw new Exception("No object with Primary key= " + id);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return user;
	}

	public Integer generateId() throws SQLException {

		Integer maxId = -1;

		try {
			openConnection();

			String querystring = "SELECT MAX(ID) FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();

			if (rs.next())
				maxId = rs.getInt(1);

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return maxId + 1;
	}

	public static void main(String[] args) {

		UserDAO userDAO = new UserDAO(User.class);
		// User u = new User();

		try {
			System.out.print(userDAO.findByPrimaryKey(3));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
