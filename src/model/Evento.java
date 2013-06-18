package model;

import java.io.Serializable;
import java.util.List;

public class Evento implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer idEvento;
	private List<Integer> start;
	private List<Integer> end;
	private Double lat;
	private Double lon;
	private Integer idEventType;
	private String nomeEvento;
	private Integer idCitta;

	public Integer getIdEvento() {
		return idEvento;
	}

	public void setIdEvento(Integer id) {
		this.idEvento = id;
	}

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

	public Integer getIdEventType() {
		return idEventType;
	}

	public void setIdEventType(Integer idEventType) {
		this.idEventType = idEventType;
	}

	public String getNomeEvento() {
		return nomeEvento;
	}

	public void setNomeEvento(String name) {
		this.nomeEvento = name;
	}

	public List<Integer> getStart() {
		return start;
	}

	public void setStart(List<Integer> start) {
		this.start = start;
	}

	public List<Integer> getEnd() {
		return end;
	}

	public void setEnd(List<Integer> end) {
		this.end = end;
	}

	public Integer getIdCitta() {
		return idCitta;
	}

	public void setIdCitta(Integer idCitta) {
		this.idCitta = idCitta;
	}

}
