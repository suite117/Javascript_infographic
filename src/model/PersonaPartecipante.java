package model;
import java.io.Serializable;


public class PersonaPartecipante implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private Integer idEvento;
	private Integer idPersona;
	private Integer idTipoRuolo;
	private Integer idPericolosita;
	
	
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
	public Integer getIdPersona() {
		return idPersona;
	}
	public void setIdPersona(Integer idPersona) {
		this.idPersona = idPersona;
	}
	public Integer getIdTipoRuolo() {
		return idTipoRuolo;
	}
	public void setIdTipoRuolo(Integer idTipoRuolo) {
		this.idTipoRuolo = idTipoRuolo;
	}
	public Integer getIdPericolosita() {
		return idPericolosita;
	}
	public void setIdPericolosita(Integer idPericolosita) {
		this.idPericolosita = idPericolosita;
	}
	

}
