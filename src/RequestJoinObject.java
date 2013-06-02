import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.PP;

import DAO.DBUtils;
import GSON.ObjectElement;
import GSON.QueryElements;
import com.google.gson.Gson;

/**
 * Servlet implementation class RequestObject
 */
@WebServlet("/RequestJoinObject")
public class RequestJoinObject extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RequestJoinObject() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {

		Map params = request.getParameterMap();
		Iterator i = params.keySet().iterator();

		String key = null;
		if (i.hasNext()) {
			key = (String) i.next();
			// String value = ((String[]) params.get(key))[0];
		}

		if (key == null)
			return;

		//System.out.println("in " + key);
		Gson gson = new Gson();

		QueryElements qe = gson.fromJson(key, QueryElements.class);
		Map<String, String> domainElementsPlusTable = new HashMap<String, String>();
		domainElementsPlusTable.put("Chi", "persona.id");
		domainElementsPlusTable.put("Dove", "evento.id");
		domainElementsPlusTable.put("Quando", "evento.id");

		String whereCondition = "";

		for (Entry<String, String> entry : domainElementsPlusTable.entrySet()) {
			//System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());

			List<ObjectElement> domainElementsList = null;

			Method method = null;
			try {
				method = qe.getClass().getMethod("get" + entry.getKey());
			} catch (SecurityException | NoSuchMethodException e) {
				System.err.println(e);
			}
			try {
				domainElementsList = (List<ObjectElement>) method.invoke(qe);
			} catch (IllegalArgumentException | IllegalAccessException | InvocationTargetException e) {
				System.err.println(e);
			}

			// chiList = qe.getChi();
			boolean oneLeastIncluded = false;

			// verifico se non ci sono elementi di uguaglianza
			for (ObjectElement el : domainElementsList)
				if (el.isIncluded()) {
					oneLeastIncluded = true;
					break;
				}
			for (int j = 0; j < domainElementsList.size(); j++) {
				ObjectElement el = domainElementsList.get(j);
				if (oneLeastIncluded && el.isIncluded()) {
					if (j == 0)
						whereCondition += " AND (" + entry.getValue() + "=" + el.getId();
					else
						whereCondition += " OR " + entry.getValue() + "=" + el.getId();

				} else if (!oneLeastIncluded) {
					whereCondition += " AND " + entry.getValue() + "!=" + el.getId();
				}
				//System.out.println(el.getId() + " " + el.isIncluded());
			}

			if (oneLeastIncluded)
				whereCondition += ")";

		}

		List<PP> personePartecipanti = new ArrayList<PP>();
		int ii = 0;
		try {
			DBUtils.openConnection();
			String querystring = "SELECT * FROM persona, personapartecipante, evento WHERE persona.id = personapartecipante.idpersona AND evento.id = personapartecipante.idevento";

			System.out.println("query: " + querystring + whereCondition);

			querystring += whereCondition;
			PreparedStatement ptmt = DBUtils.getConnection().prepareStatement(querystring);
			ResultSet rs = ptmt.executeQuery();

			while (rs.next()) {
				ii++;
				PP pp = new PP();
				pp.setId(rs.getInt(1));
				pp.setNome(rs.getString(2));
				pp.setDatanascita(DBUtils.dateStringToIntegerList(rs.getString(3)));
				pp.setImage("table/images/user-icon.jpg");

				pp.setNomeEvento("evento " + pp.getId());
				pp.setIdPersona(rs.getInt(6));
				pp.setIdTipoRuolo(rs.getInt(7));
				
				pp.setIdEvento(rs.getInt(9));
				
				
				int day = (int) Math.round(1 + 29 * Math.random());
				pp.setStart(DBUtils.dateStringToIntegerList("2013-01-" + day));
				//pp.setEnd(DBUtils.dateStringToIntegerList("2013-01-" + (day + 1)));
				pp.setLat(53.73 - 1.5 * Math.random());
				pp.setLon(-0.30 - 1.5 * Math.random());
				
				pp.setIdEventType((int) Math.round(Math.random() * 100));
				pp.setIdPericolosita(rs.getInt(9));

				personePartecipanti.add(pp);
			}
		} catch (SQLException e) {
			System.err.println(e.getMessage());
		} finally {
			DBUtils.closeConnection();
		}

		System.out.println("n° elementi " + ii);
		String out = gson.toJson(personePartecipanti);
		System.out.println("out Join " + out);
		// creazione json di risposta
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(out);
		pw.close();
	}
}
