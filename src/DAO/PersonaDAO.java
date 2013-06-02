package DAO;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Persona;

public class PersonaDAO extends DAO<Persona, Integer> {

	public PersonaDAO(Class<Persona> objectClass) {
		super(objectClass);
	}

	@Override
	public List<Persona> findAll() throws SQLException, Exception {
		List<Persona> persone = new ArrayList<Persona>();
		Persona persona = null;
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
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return persone;
	}

	public void update(Persona objectBean) throws SQLException {
		try {
			openConnection();

			String querystring = "UPDATE " + tableName + " SET "
					+ "ID=?,NOME=?," + "DATANASCITA=?,DATAMORTE=? WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, objectBean.getId());
			ptmt.setString(2, objectBean.getNome());
			//ptmt.setString(3, objectBean.getDatanascita());
			//ptmt.setString(4, objectBean.getDatamorte());
			ptmt.setInt(5, objectBean.getId());

			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}
	}

	public static void main(String[] args) {

		PersonaDAO personaDAO = new PersonaDAO(Persona.class);
		Persona p = new Persona();
		p.setId(1);
		p.setNome("cri1");

		try {
			personaDAO.update(p);
			System.out.print(personaDAO.findAll());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Override
	public void add(Persona objectBean) throws SQLException {
		// TODO Auto-generated method stub
		
	}
}
