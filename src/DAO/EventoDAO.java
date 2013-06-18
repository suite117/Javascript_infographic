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
					+ "FINETEMPO=?,COORDX=?,COORDY=?,IDTIPOEVENTO=?,IDCITTA=?,NOME_EVENTO=? WHERE ID=?";

			ptmt = getConnection().prepareStatement(querystring);
			ptmt.setInt(1, evento.getIdEvento());
			ptmt.setString(2, DBUtils.integerListToDateString(evento.getStart()));
			ptmt.setString(3, DBUtils.integerListToDateString(evento.getEnd()));
			ptmt.setDouble(4, evento.getLat());
			ptmt.setDouble(5, evento.getLon());
			ptmt.setInt(6, evento.getIdEventType());
			ptmt.setInt(7, evento.getIdCitta());
			ptmt.setString(8, evento.getNomeEvento());
			ptmt.setInt(9, evento.getIdEvento());

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
			ptmt.setString(2, DBUtils.integerListToDateString(evento.getStart()));
			ptmt.setString(3, DBUtils.integerListToDateString(evento.getEnd()));
			ptmt.setDouble(4, evento.getLat());
			ptmt.setDouble(5, evento.getLon());
			ptmt.setInt(6, evento.getIdEventType());
			//ptmt.setString(7, evento.getNomeEvento());
			ptmt.setInt(7, evento.getIdCitta());
			
			ptmt.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException(e.getMessage());
		} finally {
			closeConnection();
		}

	}


	public static void main(String[] args) {

		List<Evento> events = new ArrayList<Evento>();
		EventoDAO eventoDAO = new EventoDAO(Evento.class);
		
		for (int i = 0; i < 20; i++) {
			Evento event = new Evento();
			event.setIdEvento(i);
			List<Integer> date = new ArrayList<Integer>();
			date.add(2013); //anno
			date.add((i % 12 ) + 1); //mese
			date.add((i % 30 ) + 1); //giorno
			date.add((i % 24 ) + 1); //ora
			event.setStart(date); //ora
			//event.setEnd(i + 20);
			event.setNomeEvento("evento " + i);
			event.setLat(53.73 - 0.5 + Math.random() );
			event.setLon(-0.30 - 0.5 + Math.random() );
	
			event.setIdEventType((int) Math.round(Math.random() * 100));
			event.setIdCitta((int) Math.round(Math.random() * 1000));
			events.add(event);
			
		}
		
		try {
			for (int i = 0; i < events.size(); i++) {
				System.out.println(events.get(i).getIdEvento());
				eventoDAO.update(events.get(i));	
			}
			
			System.out.print(eventoDAO.findAll());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
