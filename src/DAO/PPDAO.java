package DAO;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Evento;
import model.PP;
import model.PersonaPartecipante;

public class PPDAO extends DAO<PP, Integer> {

	public PPDAO(String string) {
		super(string);
		// TODO Auto-generated constructor stub
	}

	@Override
	public List<PP> findAll() throws SQLException, Exception {
		List<PP> personePartecipanti = new ArrayList<PP>();

		try {
			openConnection();
			String querystring = "SELECT * "
					+ "FROM persona p "
					+ "INNER JOIN personapartecipante as pp ON p.id = pp.idPersona "
					+ "INNER JOIN evento as e ON pp.idEvento = e.id";

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();

			while (rs.next()) {

				PP pp = new PP();
//				for (int i = 1; i < 15; i++) {
//					try {
//						System.out.print(rs.getInt(i) + " ");
//					} catch (Exception e) {
//						System.out.print(rs.getString(i) + " ");
//					}
				pp.setId(rs.getInt(1));
				pp.setNome(rs.getString(2));
				pp.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
				pp.setIdEvento(rs.getInt(6));
				pp.setIdPersona(rs.getInt(7));
				pp.setIdTipoRuolo(rs.getInt(8));
				pp.setIdPericolosita(rs.getInt(9));
				pp.setLat(rs.getDouble(13));
				pp.setLon(rs.getDouble(14));
				
				personePartecipanti.add(pp);

			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return personePartecipanti;
	}

	public static void main(String[] args) {

		PPDAO ppDAO = new PPDAO("");

		List<PP> pps = null;

		try {
			pps = ppDAO.findAll();
			for (PP p : pps)
				System.out.print(p.getId());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}


	@Override
	public void add(PP objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(PP objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}

}
