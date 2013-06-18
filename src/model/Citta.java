package model;

import java.io.Serializable;

public class Citta implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer idCitta;
	private String name;
	private Double lat;
	private Double lon;
	


	public double getLat() {
		return lat;
	}

	public void setLat(double d) {
		this.lat = d;
	}

	public double getLon() {
		return lon;
	}

	public void setLon(double d) {
		this.lon = d;
	}

	public Integer getIdCitta() {
		return idCitta;
	}

	public void setIdCitta(Integer idCitta) {
		this.idCitta = idCitta;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}