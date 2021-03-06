package GSON;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import model.Evento;
import DAO.EventoDAO;

import com.google.gson.Gson;

public class PersonaEventoJSON {

	public static void main(String[] args) {

		EventoDAO eventoDAO = new EventoDAO(Evento.class);
		

		for (int i = 0; i < 100; i++) {
			Evento event = new Evento();

			event.setIdEvento(i);
			//event.setStartTime(i + 10);
			//event.setEndTime(i + 20);

			event.setLat(53.73 - 0.5 + Math.random() * 0.5);
			event.setLon(-0.30 - 0.5 + Math.random() * 0.5);

			event.setIdEventType((int) Math.round(Math.random() * 100));
			
			try {
				eventoDAO.overwrite(event);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		List<Evento> events = null;
		
		try {
			events = eventoDAO.findAll();
		} catch (Exception  e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		Gson gson = new Gson();
		String eventsJson = gson.toJson(events);
		System.out.println(eventsJson);

		try {
			FileWriter writer = new FileWriter("events.json");
			writer.write(eventsJson);
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
