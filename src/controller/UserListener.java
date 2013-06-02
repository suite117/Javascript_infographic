package controller;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import db.UserDAO;

import model.User;


/**
 * Application Lifecycle Listener implementation class UserListener
 * 
 */
@WebListener
public class UserListener implements ServletContextListener,
		ServletContextAttributeListener {

	/**
	 * Default constructor.
	 */
	public UserListener() {
		// TODO Auto-generated constructor stub
	}
	
	void createUsers() {
		
	}

	/**
	 * @see ServletContextListener#contextInitialized(ServletContextEvent)
	 */
	public void contextInitialized(ServletContextEvent sc) {
		// TODO Auto-generated method stub
		UserDAO userDAO = new UserDAO(User.class);

		ServletContext service = sc.getServletContext();

		List<User> users;
		try {
			users = userDAO.findAll();
			service.setAttribute("users", users);
			service.setAttribute("name", "user1");
			service.setAttribute("base-url", "/ServletTest");
		} catch (Exception e) {
			e.printStackTrace();
		}
		

	}

	/**
	 * @see ServletContextAttributeListener#attributeAdded(ServletContextAttributeEvent)
	 */
	public void attributeAdded(ServletContextAttributeEvent arg0) {
		// TODO Auto-generated method stub
	}

	/**
	 * @see ServletContextAttributeListener#attributeReplaced(ServletContextAttributeEvent)
	 */
	public void attributeReplaced(ServletContextAttributeEvent arg0) {
		// TODO Auto-generated method stub
	}

	/**
	 * @see ServletContextAttributeListener#attributeRemoved(ServletContextAttributeEvent)
	 */
	public void attributeRemoved(ServletContextAttributeEvent arg0) {
		// TODO Auto-generated method stub
	}

	/**
	 * @see ServletContextListener#contextDestroyed(ServletContextEvent)
	 */
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
	}

}
