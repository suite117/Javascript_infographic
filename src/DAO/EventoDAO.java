package DAO;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Evento;


public class EventoDAO extends DAO<Evento, Integer> {

	public EventoDAO(Class<Evento> objectClass) {
		super(objectClass);
	}

	@Override
	public List<Evento> findAll() throws SQLException, Exception {
		List<Evento> persone = new ArrayList<Evento>();
		Evento evento = null;
		try {
			openConnection();
			String querystring = "SELECT * FROM " + tableName;

			ptmt = getConnection().prepareStatement(querystring);
			rs = ptmt.executeQuery();
			while (rs.next()) {
				evento = new Evento();
				evento.setIdEvento(rs.getInt(1));
				//evento.setStartTime(rs.getInt(2));
				//evento.setEndTime(rs.getInt(3));
				evento.setLat(rs.getDouble(4));
				evento.setLon(rs.getDouble(5));
				persone.add(evento);
			}
		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

		return persone;
	}

	public void update(Evento evento) throws SQLException {
		try {
			openConnection();

			String querystring = "UPDATE " + tableName + " SET "
					+ "ID=?,INIZIOTEMPO=?,"
					+ "FINETEMPO=?,COORDX=?,COORDY=?,IDTIPOEVENTO=? WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, evento.getIdEvento());
			//ptmt.setInt(2, evento.getStart());
			//ptmt.setInt(3, evento.getEnd());
			ptmt.setDouble(4, evento.getLat());
			ptmt.setDouble(5, evento.getLon());
			ptmt.setInt(6, evento.getIdEventType());

			ptmt.setInt(7, evento.getIdEvento());

			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}
	}
	
	
	
	public void add(Evento evento) throws SQLException {
		try {
			openConnection();

			String querystring = "INSERT INTO " + tableName
					+ " VALUES(?,?,?,?,?,?)";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, evento.getIdEvento());
			//ptmt.setInt(2, evento.getStartTime());
			//ptmt.setInt(3, evento.getEndTime());
			ptmt.setDouble(4, evento.getLat());
			ptmt.setDouble(5, evento.getLon());
			ptmt.setInt(6, evento.getIdEventType());
			
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}


	public static void main(String[] args) {

		EventoDAO eventoDAO = new EventoDAO(Evento.class);

		Evento evento = new Evento();
		evento.setIdEvento(2);
		//evento.setStartTime(10);
		//evento.setEndTime(30);
		evento.setLat(10.20);
		evento.setLon(30.1);
		evento.setIdEventType(10);
		
		try {
			eventoDAO.overwrite(evento);
			System.out.print(eventoDAO.findAll());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
