package reflection;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class TestRMeth {
	public static void main(String[] args) {

		Class<?> c = null;
		try {
			c = Class.forName("model.User");

			Method listaMetodi[] = c.getDeclaredMethods();
			for (int i = 0; i < listaMetodi.length; i++) {
				Method currentMethod = listaMetodi[i];

				// Full description del Metodo
				String fullDesc = currentMethod.toString();
				System.out.println("Metodo n." + (i + 1) + ": " + fullDesc);

				// Nome e Modificatore del Metodo
				System.out.println("Nome: " + currentMethod.getName());
				String modificatore = Modifier.toString(currentMethod
						.getModifiers());
				System.out.println("Modificatore d'Accesso: " + modificatore);

				// Eventuali Parametri del Metodo
				Class<?> tipiParam[] = currentMethod.getParameterTypes();
				if (tipiParam.length == 0)
					System.out
							.println("Il metodo suddetto non prevede alcun parametro!");
				else
					System.out
							.println("Il metodo suddetto prevede i seguenti parametri: ");
				for (int j = 0; j < tipiParam.length; j++)
					System.out.println(tipiParam[j].getName());

				// Parametro di Ritorno
				Class<?> returnType = currentMethod.getReturnType();
				System.out.println("Tipo di ritorno: " + returnType.getName());

				// Eventuali Eccezioni
				Class<?> eccezioni[] = currentMethod.getExceptionTypes();
				if (eccezioni.length == 0)
					System.out
							.println("Il metodo suddetto non solleva eccezioni!");
				else
					System.out
							.println("Il metodo suddetto può sollevare le seguienti eccezioni: ");
				for (int j = 0; j < eccezioni.length; j++)
					System.out.println(eccezioni[j].getName());
			}

		} catch (ClassNotFoundException e) {

			e.printStackTrace();
		}
	}
}