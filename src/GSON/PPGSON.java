package GSON;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.Evento;
import model.PP;
import DAO.PPDAO;

import com.google.gson.Gson;

public class PPGSON {
	public static void main(String[] args) {

		PPDAO ppDAO = new PPDAO("");

		List<PP> ppList = null;

		try {
			ppList = ppDAO.findAll();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		List<Evento> events = new ArrayList<Evento>();
		for (int i = 0; i < 20; i++) {
			Evento event = new Evento();
			event.setIdEvento(i);
			event.setNomeEvento("evento " + i);
			List<Integer> data = new ArrayList<Integer>();
			data.add(2013);
			data.add(1);
			data.add( (int)(10 + i * Math.random()) % 30);
			data.add(i % 24);

			event.setStart(data);
			data.set(1, (int) (data.get(1) + i * Math.random()) % 12);
			//event.setEnd(null);
			
			event.setLat(53.73 - 0.5 + Math.random());
			event.setLon(-0.30 - 0.5 + Math.random());
			event.setIdEventType((int) Math.round(Math.random() * 100));
			events.add(event);
		}

		for (int i = 0; i < ppList.size(); i++) {
			Evento event = events.get((int) (20 * Math.random()));

			ppList.get(i).setImage("table/images/user-icon.jpg");
			ppList.get(i).setIdEvento(event.getIdEvento());
			ppList.get(i).setNomeEvento(event.getNomeEvento());
			ppList.get(i).setStart(event.getStart());
			ppList.get(i).setEnd(event.getEnd());
			ppList.get(i).setLat(event.getLat());
			ppList.get(i).setLon(event.getLon());
			ppList.get(i).setIdEventType(event.getIdEventType());
		}

		Gson gson = new Gson();
		String eventsJson = gson.toJson(ppList);
		System.out.println(eventsJson);

		try {
			FileWriter writer = new FileWriter("pp.json");
			writer.write(eventsJson);
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
