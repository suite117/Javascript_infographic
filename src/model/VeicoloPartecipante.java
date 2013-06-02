package model;
import java.io.Serializable;


public class VeicoloPartecipante implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private Integer idEvento;
	private Integer idVeicolo;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getIdEvento() {
		return idEvento;
	}
	public void setIdEvento(Integer idEvento) {
		this.idEvento = idEvento;
	}
	public Integer getIdVeicolo() {
		return idVeicolo;
	}
	public void setIdVeicolo(Integer idVeicolo) {
		this.idVeicolo = idVeicolo;
	}
	

}
