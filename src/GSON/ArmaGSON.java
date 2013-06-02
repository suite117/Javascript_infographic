package GSON;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;

import model.Arma;
import DAO.ArmaDAO;

public class ArmaGSON {
	public static void main(String[] args) {
		ArmaDAO armaDAO = new ArmaDAO(Arma.class);

		List<Arma> armi = null;
		try {
			armi = armaDAO.findAll();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Gson gson = new Gson();
		String armiJson = gson.toJson(armi);
		System.out.println(armiJson);
		
		try {
			FileWriter writer1 = new FileWriter("armi.json");
			writer1.write(armiJson);
			writer1.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}
