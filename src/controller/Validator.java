package controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Validator {

	final static String NUMBER = "([0-9]+)";
	final static String NAME = "([a-z]+)";
	final static String USERNAME = "([a-zA-Z0-9]+)";
	final static String EMAIL = "([a-zA-Z]+@[a-zA-Z]+)";

	static boolean isMissing(String value) {

		if (value == null || value.trim().equals(""))
			return true;
		else
			return false;
	}

	public static String name(String in) throws Exception {
		return regExp(in, NAME, "Nome non valido.");
	}

	public static String username(String in) throws Exception {
		return regExp(in, USERNAME, "Nome utente '" + in + "' non valido.");
	}

	public static String email(String in) throws Exception {
		return regExp(in, EMAIL, "Email '" + in + "' non valida.");
	}

	public static String regExp(String in, String regex, String errorMessage)
			throws Exception {
		String out = null;

		if (in.equals(""))
			out = in;
		else {
			Pattern pattern = Pattern.compile(regex);
			Matcher matcher = pattern.matcher(in);
			if (!matcher.matches())
				throw new Exception(errorMessage);
			else
				out = in;
		}

		return out;
	}

	public static Integer toInt(String in) throws Exception {

		Integer out = null;

		Pattern pattern = Pattern.compile(NUMBER);
		// Quindi ottenuta l' istanza passiamo ad elaborare il testo con il
		// metodo matcher():
		Matcher matcher = pattern.matcher(in);

		if (isMissing(in)) {
			throw new Exception("Valore richiesto.");
		} else if (!matcher.matches()) {
			throw new Exception("Numero intero '" + in + "' non valido.");
		} else {
			out = Integer.parseInt(in);
		}

		return out;
	}
}
