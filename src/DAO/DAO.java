package DAO;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public abstract class DAO<T, K> {

	protected final String dbName = "synthesys";
	protected final String url = "jdbc:postgresql://localhost:5432/";
	String driver = "org.postgresql.Driver";
	
	protected final String username = "postgres";
	protected final String password = "admin";
	private Connection connection;
	protected PreparedStatement ptmt = null;
	protected ResultSet rs = null;

	Class<T> objectClass;
	protected String tableName = null;
	

	public DAO(Class<T> objectClass) {
		this.objectClass = objectClass;
		tableName = objectClass.getSimpleName();
	}

	//public abstract K generateId() throws SQLException;

	//public abstract void create() throws SQLException;

	public DAO(String string) {
		// TODO Auto-generated constructor stub
	}

	public abstract void add(T objectBean) throws SQLException;

	public abstract void update(T objectBean) throws SQLException;

	//public abstract void delete(K id) throws SQLException;

	public abstract List<T> findAll() throws SQLException, Exception;

	//public abstract Map<K, T> findAllMap() throws SQLException, Exception;

	//public abstract T findByPrimaryKey(K id) throws Exception;

	public Connection openConnection() throws SQLException {
		try {
			Class.forName(driver);
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
	
	public void overwrite(T objectBean) throws SQLException {
		try {
			add(objectBean);
		} catch (SQLException e) {
			update(objectBean);
		}
		
	}

}
