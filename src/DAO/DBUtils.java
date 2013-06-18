package DAO;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import GSON.ObjectElement;
import GSON.QueryElements;

import model.PP;

public class DBUtils {
	static final String dbName = "synthesys";
	static final String url = "jdbc:postgresql://localhost:5432/";
	static final String driver = "org.postgresql.Driver";

	static final String username = "postgres";
	static final String password = "admin";
	static Connection connection;
	static PreparedStatement ptmt = null;
	static ResultSet rs = null;

	public static void isSQLString(String str) throws SQLException {
		String s = str.toLowerCase();
		if (s.contains("OR ") || s.contains("AND "))
			throw new SQLException("SQL Injection detected.");
	}

	@SuppressWarnings("unchecked")
	public static String whereConditionToString(QueryElements queryElements, Map<String, String> queryElementsPlusColumnId) throws SQLException {
		String whereCondition = "";

		for (Entry<String, String> entry : queryElementsPlusColumnId.entrySet()) {
			//System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());

			List<ObjectElement> domainElementsList = null;

			Method method = null;
			try {
				method = queryElements.getClass().getMethod("get" + entry.getKey());
			} catch (SecurityException | NoSuchMethodException e) {
				System.err.println(e);
			}
			try {
				domainElementsList = (List<ObjectElement>) method.invoke(queryElements);
			} catch (IllegalArgumentException | IllegalAccessException | InvocationTargetException e) {
				System.err.println(e);
			}

			boolean oneLeastIncluded = false;

			// verifico se non ci sono elementi di uguaglianza
			for (ObjectElement el : domainElementsList)
				if (el.isIncluded()) {
					oneLeastIncluded = true;
					break;
				}
			for (int j = 0; j < domainElementsList.size(); j++) {
				ObjectElement el = domainElementsList.get(j);

				if (oneLeastIncluded && el.isIncluded()) {
					if (j == 0)
						whereCondition += " AND (" + entry.getValue() + "=" + el.getId();
					else
						whereCondition += " OR " + entry.getValue() + "=" + el.getId();

				} else if (!oneLeastIncluded) {
					whereCondition += " AND " + entry.getValue() + "!=" + el.getId();
				}
				// System.out.println(el.getId() + " " + el.isIncluded());
			}

			if (oneLeastIncluded)
				whereCondition += ")";

		}

		return whereCondition;
	}

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

	public static ResultSet executeQuery(String tableName, String whereCondition) throws SQLException {
		if (tableName != null)
			try {
				openConnection();
				String queryString = "SELECT * FROM " + tableName;
				
				if (whereCondition.length() > 0)
					queryString += " WHERE " + whereCondition;

				ptmt = getConnection().prepareStatement(queryString);
				rs = ptmt.executeQuery();
			} catch (SQLException e) {
				throw new SQLException(e.getMessage());
			} finally {
				// closeConnection();
			}

		return rs;
	}

	public static ResultSet executeQuery(String tableName, Map<String, String> wheresCondition) throws SQLException {
		String whereCondition = "";
		if (tableName != null)
			try {
				openConnection();
				String queryString = "SELECT * FROM " + tableName;

				List<String> conditionsValues = new ArrayList<String>();
				for (Entry<String, String> entry : wheresCondition.entrySet()) {
					whereCondition += entry.getKey() + " = ? AND ";
					conditionsValues.add(entry.getValue());
				}

				if (whereCondition.length() > 0)
					queryString += " WHERE " + whereCondition;
				
				System.out.println("Query:" + queryString);
				ptmt = getConnection().prepareStatement(queryString);

				for (int i = 0; i < conditionsValues.size(); i++) {
					ptmt.setString(i + 1, conditionsValues.get(i));
				}

				rs = ptmt.executeQuery();
			} catch (SQLException e) {
				throw new SQLException(e.getMessage());
			} finally {
				// closeConnection();
			}

		return rs;
	}

	public static ResultSet executeQueryJoin(String[] tableNames, String[] joinsColumns, String whereCondition) throws SQLException {

		String querystring = "SELECT * FROM " + sliceStringArray(tableNames);

		querystring += " WHERE " + sliceStringArray(joinsColumns, " AND ") + whereCondition;

		if (tableNames.length > 0)
			try {
				openConnection();
				System.out.println("query: " + querystring);

				ptmt = getConnection().prepareStatement(querystring);
				rs = ptmt.executeQuery();
			} catch (SQLException e) {
				throw new SQLException(e.getMessage());
			} finally {
				// closeConnection();
			}

		return rs;
	}

	public static void main(String[] args) throws SQLException {
		String[] tableNames = { "persona", "personapartecipante", "evento" };
		String[] joinsColumns = { "persona.id = personapartecipante.idpersona", "evento.id = personapartecipante.idevento" };

		List<PP> personePartecipanti = new ArrayList<PP>();
		PP pp = new PP();

		try {
			rs = executeQueryJoin(tableNames, joinsColumns, "");

			while (rs.next()) {

				pp.setId(rs.getInt(1));
				pp.setNome(rs.getString(2));
				pp.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
				pp.setImage("table/images/user-icon.jpg");

				pp.setNomeEvento("evento " + rs.getInt(5));
				pp.setIdPersona(rs.getInt(6));
				pp.setIdTipoRuolo(rs.getInt(7));

				pp.setIdEvento(rs.getInt(9));

				int day = (int) Math.round(1 + 29 * Math.random());
				pp.setStart(DBUtils.dateStringToIntegerList(rs.getString(10)));
				if (pp.getId() % 2 != 0)
					pp.setEnd(DBUtils.dateStringToIntegerList("2013-01-" + (day + 1)));
				pp.setLat(rs.getDouble(12));
				pp.setLon(rs.getDouble(13));

				// pp.setIdEventType((int) Math.round(Math.random() * 100));
				pp.setIdEventType(rs.getInt(14));
				pp.setIdPericolosita(rs.getInt(9));

				personePartecipanti.add(pp);

				// System.out.println(pp);
			}
		} catch (SQLException e) {
			// e.printStackTrace();
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

	public static String sliceStringArray(String[] arr) {
		return sliceStringArray(arr, ",");
	}

	public static String sliceStringArray(String[] arr, String separator) {
		StringBuilder sb = new StringBuilder();

		for (String n : arr) {
			if (sb.length() > 0)
				sb.append(separator);
			sb.append(n);
		}
		return sb.toString();
	}

	public static String sliceStringArray(List<String> ids, String separator) {
		String idList = ids.toString();
		// String csv = idList.substring(1, idList.length() - 1).replace(", ",
		// ",");

		return idList;
	}
}
