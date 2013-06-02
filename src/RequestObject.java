import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.Evento;
import model.Persona;
import model.Tempo;

import DAO.DBUtils;
import com.google.gson.Gson;

/**
 * Servlet implementation class RequestObject
 */
@WebServlet("/RequestObject")
public class RequestObject extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RequestObject() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// doPost(request, response);
		String elementName = request.getParameter("element");

		List<Persona> persone = new ArrayList<Persona>();
		List<Evento> eventi = new ArrayList<Evento>();
		List<Tempo> tempi = new ArrayList<Tempo>();

		String tableName = null;
		switch (elementName) {
		case "persone":
			tableName = "persona";
			break;
		case "cosa":
			tableName = "persona";
			break;
		case "luoghi":
			tableName = "evento";
			break;
		case "tempi":
			// tableName = "evento";
			for (int i = 1; i < 30; i++) {
				Tempo tempo = new Tempo();
				tempo.setIdTempo(i);
				if (i<=9)
					tempo.setStart(DBUtils.dateStringToIntegerList("2013-01-0" + i));
				else
					tempo.setStart(DBUtils.dateStringToIntegerList("2013-01-" + i));
				tempo.setNome(DBUtils.integerListToDateString(tempo.getStart()));
				tempi.add(tempo);
			}
			break;
		}

		if (tableName != null)
			try {
				DBUtils.openConnection();
				String querystring = "SELECT * FROM " + tableName;

				// System.out.println("query: " + querystring);

				PreparedStatement ptmt = DBUtils.getConnection().prepareStatement(querystring);
				ResultSet rs = ptmt.executeQuery();

				while (rs.next()) {
					switch (elementName) {
					case "persone":
						Persona persona = new Persona();
						persona.setId(rs.getInt(1));
						persona.setNome(rs.getString(2));
						persona.setImmagine("table/images/user-icon.jpg");
						persona.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
						persone.add(persona);
						break;
					case "luoghi":
						Evento evento = new Evento();
						evento.setIdEvento(rs.getInt(1));
						evento.setNomeEvento("evento " + evento.getIdEvento());
						evento.setStart(DBUtils.dateStringToIntegerList(rs.getString(2)));
						evento.setEnd(DBUtils.dateStringToIntegerList(rs.getString(3)));
						evento.setLat(53.73 - 1.5 * Math.random());
						evento.setLon(-0.30 - 1.5 * Math.random());
						evento.setIdEventType((int) Math.round(Math.random() * 100));
						eventi.add(evento);
						break;
					}
				}

			} catch (SQLException e) {
				System.err.println(e.getMessage());
			} finally {
				DBUtils.closeConnection();
			}

		Gson gson = new Gson();
		String outJSON = null;
		switch (elementName) {
		case "persone":
			outJSON = gson.toJson(persone);
			break;
		case "luoghi":
			outJSON = gson.toJson(eventi);
			break;
		case "tempi":
			outJSON = gson.toJson(tempi);
		}

		
			System.out.println("out " + outJSON);
		// creazione json di risposta
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(outJSON);
		pw.close();
	}

}
