package DAO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Persona;

public class DBUtils {
	static final String dbName = "synthesys";
	static final String url = "jdbc:postgresql://localhost:5432/";
	static final String driver = "org.postgresql.Driver";

	static final String username = "postgres";
	static final String password = "admin";
	static Connection connection;
	static PreparedStatement ptmt = null;
	static ResultSet rs = null;

	public static Connection openConnection() throws SQLException {
		try {
			Class.forName(driver);
			setConnection(DriverManager.getConnection(url + dbName, username, password));
		} catch (ClassNotFoundException e) {
			System.err.println(e.getMessage());
		}
		return getConnection();
	}

	public static void closeConnection() {
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

	public static Connection getConnection() {
		return connection;
	}

	public static void setConnection(Connection conn) {
		connection = conn;
	}

	public static void main(String[] args) throws SQLException {
		String tableName = "persona";
		List<Persona> persone = new ArrayList<Persona>();
		Persona persona = new Persona();

		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				persona = new Persona();
				persona.setId(rs.getInt(1));
				persona.setNome(rs.getString(2));
				persona.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
				persona.setDatamorte(DBUtils.dateStringToIntegerList(rs.getString(4)));
				persone.add(persona);
				System.out.println(persona);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}

	public static List<Integer> dateStringToIntegerList(String date) {
		List<Integer> out = new ArrayList<Integer>();

		if (date != null) {
			String[] dateArr = date.split("-");
			for (String dateEl : dateArr)
				out.add(Integer.parseInt(dateEl));
		}
		return out;
	}

	public static String integerListToDateString(List<Integer> dateList) {
		String out = "";

		if (dateList != null) {
			for (int i = 0; i < dateList.size() - 1; i++) {
				if (dateList.get(i) <= 9)
					out += "0" + dateList.get(i) + "-";
				else
					out += dateList.get(i) + "-";
			}
			if (dateList.get(dateList.size() - 1) <= 9)
				out += "0" + dateList.get(dateList.size() - 1);
			else
				out += dateList.get(dateList.size() - 1);
		}
		return out;
	}

	public static List<String> dateStringToStringList(String date) {
		List<String> out = new ArrayList<String>();

		if (date != null) {
			String[] dateArr = date.split("-");
			for (String dateEl : dateArr)
				out.add(dateEl);
		}
		return out;
	}

	public static String stringListToDateString(List<String> dateList) {
		String out = "";

		if (dateList != null) {
			for (int i = 0; i < dateList.size() - 1; i++)
				out += dateList.get(i) + "-";

			out += dateList.get(dateList.size() - 1);
		}
		return out;
	}

}
