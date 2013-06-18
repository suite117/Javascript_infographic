package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.Citta;
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
		//Map<String, String> whereConditions = new HashMap<String,String>();

		List<Persona> persone = new ArrayList<Persona>();
		List<Citta> cittaList = new ArrayList<Citta>();
		List<Tempo> tempi = new ArrayList<Tempo>();

		// in queste condizioni lo switch permette di restringere i casi e
		// prevenire la sql injection
		String tableName = "";
		String whereCondition = "";
		switch (elementName) {
		case "persone":
			tableName = "persona";
			break;
		case "cosa":
			tableName = "persona";
			break;
		case "luoghi":
			tableName = "citta";
			whereCondition = "CAPOLUOGO_PROVINCIA=1";
			break;
		case "tempi":
			for (int i = 1; i < 30; i++) {
				Tempo tempo = new Tempo();
				tempo.setIdTempo(i);
				if (i <= 9)
					tempo.setStart(DBUtils.dateStringToIntegerList("2013-01-0" + i));
				else
					tempo.setStart(DBUtils.dateStringToIntegerList("2013-01-" + i));
				tempo.setNome(DBUtils.integerListToDateString(tempo.getStart()));
				tempi.add(tempo);
			}
			break;
		default:
			System.err.println("Richiesta elemento errato " + elementName);
			return;
		}

		try {
			ResultSet rs = DBUtils.executeQuery(tableName, whereCondition);

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

					Citta citta = new Citta();
					citta.setIdCitta(rs.getInt(1));
					citta.setName(rs.getString(2));
					citta.setLat(rs.getDouble(4));
					citta.setLon(rs.getDouble(5));
					cittaList.add(citta);
					break;
				}
			}
		} catch (SQLException e) {
			// e.printStackTrace();
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
			// outJSON = gson.toJson(eventi);
			outJSON = gson.toJson(cittaList);
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
