package DAO;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Citta;

public class CittaDAO extends DAO<Citta, Integer> {

	public CittaDAO(Class<Citta> objectClass) {
		super(objectClass);
		// TODO Auto-generated constructor stub
	}

	@Override
	public List<Citta> findAll() throws SQLException, Exception {
		// TODO Auto-generated method stub
		List<Citta> cittaList = new ArrayList<Citta>();
		Citta citta = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				citta = new Citta();
				citta.setIdCitta(rs.getInt(1));
				citta.setName(rs.getString(2));
				citta.setLat(rs.getDouble(4));
				citta.setLon(rs.getDouble(5));
				cittaList.add(citta);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return cittaList;
	}

	@Override
	public void add(Citta objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(Citta objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}
	
	
	public static void main(String[] args) {
		CittaDAO cittaDAO = new CittaDAO(Citta.class);
		
		try {
			System.out.print(cittaDAO.findAll());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
