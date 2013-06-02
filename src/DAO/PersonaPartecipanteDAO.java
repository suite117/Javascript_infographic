package DAO;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Evento;
import model.PersonaPartecipante;

public class PersonaPartecipanteDAO extends DAO<PersonaPartecipante, Integer>{

	public PersonaPartecipanteDAO(Class<PersonaPartecipante> objectClass) {
		super(objectClass);
	}

	@Override
	public List<PersonaPartecipante> findAll() throws SQLException, Exception {
		List<PersonaPartecipante> personePartecipanti = new ArrayList<PersonaPartecipante>();
		PersonaPartecipante personaPartecipante = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				personaPartecipante = new PersonaPartecipante();
				personaPartecipante.setId(rs.getInt(1));
				personaPartecipante.setIdEvento(rs.getInt(2));
				personaPartecipante.setIdPersona(rs.getInt(3));
				personaPartecipante.setIdTipoRuolo(rs.getInt(4));
				personaPartecipante.setIdPericolosita(rs.getInt(5));
				
				personePartecipanti.add(personaPartecipante);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return personePartecipanti;
	}

	public void update(PersonaPartecipante objectBean) throws SQLException {
		try {
			openConnection();

			String querystring = "UPDATE " + tableName + " SET "
					+ "ID=?,IDEVENTO=?," + "IDPERSONA=?,IDTIPORUOLO=?, PERICOLOSITA=? WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, objectBean.getId());
			ptmt.setInt(2, objectBean.getIdEvento());
			ptmt.setInt(3, objectBean.getIdPersona());
			ptmt.setInt(4, objectBean.getIdTipoRuolo());
			ptmt.setInt(5, objectBean.getIdPericolosita());
			
			ptmt.setInt(6, objectBean.getId());
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}
	}
	
	@Override
	public void add(PersonaPartecipante objectBean) throws SQLException {
		try {
			openConnection();

			String querystring = "INSERT INTO " + tableName
					+ " VALUES(?,?,?,?,?)";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, objectBean.getId());
			ptmt.setInt(2, objectBean.getIdEvento());
			ptmt.setInt(3, objectBean.getIdPersona());
			ptmt.setInt(4, objectBean.getIdTipoRuolo());
			ptmt.setInt(5, objectBean.getIdPericolosita());
			
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}

	public static void main(String[] args) {

		PersonaPartecipanteDAO personaPartecipanteDAO = new PersonaPartecipanteDAO(PersonaPartecipante.class);
	
		List<PersonaPartecipante> pps = null;
		
		try {
			pps = personaPartecipanteDAO.findAll();
			for (PersonaPartecipante p : pps)
				System.out.print(p.getId());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
