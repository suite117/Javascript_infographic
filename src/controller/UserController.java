package controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import db.UserDAO;

import model.User;

/**
 * Servlet implementation class RegisterController
 */
@WebServlet("/UserController")
public class UserController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	UserDAO userDAO;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UserController() {
		super();
	}

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		userDAO = new UserDAO(User.class);

	}

	/**
	 * @see Servlet#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String reqUri = request.getRequestURI().toString();
		System.out.println(reqUri);
		
		HttpSession session = request.getSession();

	
		String prevOp = (String) session.getAttribute("prevState");
		String operation = (String) session.getAttribute("state");
		String idField = request.getParameter("id");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String email = request.getParameter("email");

		List<String> errors = new ArrayList<String>();

		Transition transition = null;
		if (operation == null) {
			transition = new Transition(State.list, State.list);

		} else {
			// in caso di fallimento ritorna
			State state = State.valueOf(operation);
			if (prevOp == null)
				transition = new Transition(State.list, state);
			else
				transition = new Transition(State.valueOf(prevOp), state);
		}

		User user = null;
		Integer id = null;
		String destination = null;
		
		try {
			switch (transition.getState()) {
			case list:
				break;
			case add:
				transition.setState(State.save);
				break;
			case edit:
				transition.setState(State.save);

				id = Validator.toInt(idField);
				user = userDAO.findByPrimaryKey(id);
				// System.out.println(user);
				request.setAttribute("user", user);
			case save:

				if (transition.getPrevState() == null)
					break;
				// se lo stato precedente è
				switch (transition.getPrevState()) {
				case add:
					user = new User();
					user.setId(userDAO.generateId());
					break;
				case edit:
					// Validazione id
					id = Validator.toInt(idField);
					// Recupero oggetto dal db
					user = userDAO.findByPrimaryKey(id);
					request.setAttribute("user", user);
					break;
				default:
					break;
				}

				// Validazione campi
				user.setUsername(username);
				user.setPassword(password);
				user.setEmail(email);

				switch (transition.getPrevState()) {
				case add:
					userDAO.add(user);
					break;
				case edit:
					userDAO.update(user);
					
					break;
				default:
					break;
				}

				transition.setState(State.list);
				break;
			case delete:
				id = Validator.toInt(idField);
				userDAO.delete(id);
				transition.setState(State.list);
				break;
			default:

			}
		} catch (Exception e) {
			errors.add(e.getMessage());
		}

		request.setAttribute("prevState", transition.getPrevState());
		request.setAttribute("state", transition.getState());

		if (!errors.isEmpty())
			request.setAttribute("errors", errors);

		
		if (transition.getState() == State.list) {
			destination = "user-" + transition.getState() + ".jsp";
			List<User> users = null;
			try {
				users = userDAO.findAll();
			} catch (Exception e) {
				errors.add(e.getMessage());
			}
			request.setAttribute("users", users);

		} else {
			//destination = "user1/" + "user-" + transition.getState() + ".jsp";
			destination = "UserController/?operation=list";
		}
		RequestDispatcher dispatcher = request
				.getRequestDispatcher(destination);
		dispatcher.forward(request, response);

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
