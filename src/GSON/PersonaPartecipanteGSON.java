package GSON;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import model.PersonaPartecipante;
import DAO.PersonaPartecipanteDAO;

import com.google.gson.Gson;

public class PersonaPartecipanteGSON {
	public static void main(String[] args) {

		PersonaPartecipanteDAO ppDAO = new PersonaPartecipanteDAO(PersonaPartecipante.class);
		

		for (int i = 0; i < 100; i++) {
			PersonaPartecipante pp = new PersonaPartecipante();

			pp.setId(i);
			pp.setIdEvento((int) Math.round(Math.random() * 20));
			pp.setIdPersona((int) Math.round(Math.random() * 100));
			
			pp.setIdTipoRuolo(i);
			pp.setIdPericolosita(i);
			
			
			try {
				ppDAO.overwrite(pp);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		List<PersonaPartecipante> events = null;
		
		try {
			events = ppDAO.findAll();
		} catch (Exception  e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		Gson gson = new Gson();
		String eventsJson = gson.toJson(events);
		System.out.println(eventsJson);

		try {
			FileWriter writer = new FileWriter("personapartecipante.json");
			writer.write(eventsJson);
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
