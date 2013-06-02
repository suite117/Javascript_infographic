package model;
import java.io.Serializable;


public class GruppoOrganizzato implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String nome;
	private Integer idTipoGruppo;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public Integer getIdTipoGruppo() {
		return idTipoGruppo;
	}
	public void setIdTipoGruppo(Integer idTipoGruppo) {
		this.idTipoGruppo = idTipoGruppo;
	}

}
