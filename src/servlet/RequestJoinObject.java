package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.PP;

import DAO.DBUtils;
import GSON.Cloud;
import GSON.QueryElements;
import com.google.gson.Gson;

/**
 * Servlet implementation class RequestObject
 */
@WebServlet("/RequestJoinObject")
public class RequestJoinObject extends HttpServlet {

	int maxCloudsIds = 0;

	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RequestJoinObject() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		Map<String, String[]> params = request.getParameterMap();
		Iterator<String> i = params.keySet().iterator();

		String key = null;
		if (i.hasNext()) {
			key = (String) i.next();
			// String value = ((String[]) params.get(key))[0];
		} else
			return;

		// System.out.println("in " + key);
		Gson gson = new Gson();

		// Controllo per la sql injection -
		QueryElements queryElements = gson.fromJson(key, QueryElements.class);

		// definisco mapping elementi con colonne id delle tabelle
		Map<String, String> queryElementsPlusColumnId = new HashMap<String, String>();
		queryElementsPlusColumnId.put("Persone", "persona.id");
		// domainElementsPlusTable.put("Luoghi", "idevento");
		queryElementsPlusColumnId.put("Luoghi", "idcitta");
		queryElementsPlusColumnId.put("Tempi", "iniziotempo");

		List<PP> personePartecipanti = new ArrayList<PP>();
		
		try {

			// nome tabelle per il join
			String[] tableNames = { "persona", "personapartecipante", "evento" };
			// vincoli di coerenza delle chiavi - inizio della condizione where
			// - sql injection vulnerable
			String[] joinsColumns = { "persona.id = personapartecipante.idpersona", "evento.id = personapartecipante.idevento" };

			// converte gli elementi della query json nella condizione where -
			// sql injection safe
			String whereCondition = DBUtils.whereConditionToString(queryElements, queryElementsPlusColumnId);
			ResultSet rs = DBUtils.executeQueryJoin(tableNames, joinsColumns, whereCondition);

			while (rs.next()) {
				
				PP pp = new PP();
				pp.setId(rs.getInt(1));
				pp.setNome(rs.getString(2));
				pp.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
				pp.setImage("table/images/user-icon.jpg");

				pp.setNomeEvento("evento " + rs.getInt(5));
				pp.setIdPersona(rs.getInt(6));
				pp.setIdTipoRuolo(rs.getInt(7));

				pp.setIdEvento(rs.getInt(9));

				int day = (int) Math.round(1 + 29 * Math.random());
				pp.setStart(DBUtils.dateStringToIntegerList(rs.getString(10)));
				if (pp.getId() % 2 != 0)
					pp.setEnd(DBUtils.dateStringToIntegerList("2013-01-" + (day + 1)));
				pp.setLat(rs.getDouble(12));
				pp.setLon(rs.getDouble(13));

				// pp.setIdEventType((int) Math.round(Math.random() * 100));
				pp.setIdEventType(rs.getInt(14));
				pp.setIdPericolosita(rs.getInt(9));

				personePartecipanti.add(pp);
			}
		} catch (SQLException e) {
			System.err.println(e.getMessage());
		} finally {
			DBUtils.closeConnection();
		}

		//System.out.println("n° elementi " + ii);

		// crea la struttura della nuvola e la restituisce al generatore di nuvole
		Cloud c = new Cloud();
		c.setId(maxCloudsIds++);
		c.setName(personePartecipanti.size() + " persone dal db.");
		c.setElements(personePartecipanti);
		c.setDomain("crimini");
		String outJSON = gson.toJson(c);
		System.out.println("out Join " + outJSON);

		// creazione json di risposta
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(outJSON);
		pw.close();
	}
}
