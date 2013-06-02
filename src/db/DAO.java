package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public abstract class DAO<T, K> {

	protected final String dbName = "javadb";
	protected final String url = "jdbc:mysql://localhost:3306/";
	String driver = "com.mysql.jdbc.Driver";
	
	protected final String username = "root";
	protected final String password = "";
	private Connection connection;
	protected PreparedStatement ptmt = null;
	protected ResultSet rs = null;

	Class<T> objectClass;
	protected String tableName = null;
	

	public DAO(Class<T> objectClass) {
		this.objectClass = objectClass;
		tableName = objectClass.getSimpleName();
	}

	public abstract K generateId() throws SQLException;

	public abstract void create() throws SQLException;

	public abstract void add(T objectBean) throws SQLException;

	public abstract void update(T objectBean) throws SQLException;

	public abstract void delete(K id) throws SQLException;

	public abstract List<T> findAll() throws SQLException, Exception;

	public abstract Map<K, T> findAllMap() throws SQLException, Exception;

	public abstract T findByPrimaryKey(K id) throws Exception;

	public Connection openConnection() throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			setConnection(DriverManager.getConnection(url + dbName, username,
					password));
		} catch (ClassNotFoundException e) {
			System.err.println(e.getMessage());
		}
		return getConnection();
	}

	public void closeConnection() {
		try {
			if (rs != null)
				rs.close();
			if (ptmt != null)
				ptmt.close();
			if (getConnection() != null)
				getConnection().close();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Connection getConnection() {
		return connection;
	}

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

}
