package model;
import java.io.Serializable;


public class Partecipazione implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private Integer idGruppoOrganizzato;
	private Integer idPersone;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getIdGruppoOrganizzato() {
		return idGruppoOrganizzato;
	}
	public void setIdGruppoOrganizzato(Integer idGruppoOrganizzato) {
		this.idGruppoOrganizzato = idGruppoOrganizzato;
	}
	public Integer getIdPersone() {
		return idPersone;
	}
	public void setIdPersone(Integer idPersone) {
		this.idPersone = idPersone;
	}

}
