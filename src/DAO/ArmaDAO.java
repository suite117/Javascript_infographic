package DAO;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Arma;

public class ArmaDAO extends DAO<Arma, Integer> {

	public ArmaDAO(Class<Arma> objectClass) {
		super(objectClass);
	}

	@Override
	public List<Arma> findAll() throws SQLException, Exception {
		List<Arma> arme = new ArrayList<Arma>();
		Arma arma = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + "arma";

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				arma = new Arma();
				arma.setId(rs.getInt(1));
				arma.setIdTipo(rs.getInt(2));
				arma.setNomeArma(rs.getString(3));
				arme.add(arma);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return arme;
	}

	
	public Integer generateId() throws SQLException {
		return null;

	}

	public static void main(String[] args) {

		ArmaDAO armaDAO = new ArmaDAO(Arma.class);
		// User u = new User();

		try {

			System.out.print(armaDAO.findAll());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Override
	public void add(Arma objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(Arma objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}
}

