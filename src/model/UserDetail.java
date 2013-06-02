package model;

import java.io.Serializable;


/**
 * The persistent class for the user_details database table.
 * 
 */
public class UserDetail implements Serializable {
	private static final long serialVersionUID = 1L;

	private int userId;

	private String address;

	private String country;

	private User user;

	public UserDetail() {
	}

	public int getUserId() {
		return this.userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}