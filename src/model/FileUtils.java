package model;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FileUtils {

	String fileName;
	BufferedReader in = null;
	BufferedWriter out = null;

	FileUtils(String fileName) {
		this.fileName = fileName;
	}

	public static void main(String[] args) {
		FileUtils f = new FileUtils(
				"D:\\suite117\\Desktop\\Elenco comuni italiani xls-csv\\test.csv");
		f.openRead();
		System.out.println(f.readLine());
		System.out.println(f.readLine());
	}

	public void openRead() {
		File file = new File(fileName);

		try {
			in = new BufferedReader(new FileReader(file));
		} catch (FileNotFoundException ex) {
			Logger.getLogger(FileUtils.class.getName()).log(Level.SEVERE, null,
					ex);
		}
	}

	public void openWrite() {
		openWrite(true);
	}

	public void openWrite(boolean append) {

		File file = new File(fileName);

		// true tells to append data.
		try {
			out = new BufferedWriter(new FileWriter(file, append));
		} catch (IOException e) {

		}

	}

	

	public String readLine() {
		String line = null;
		try {
			line = in.readLine();
			//if (line == null)
				//throw new IOException ("End of file.");
		} catch (IOException e) {
			Logger.getLogger(FileUtils.class.getName()).log(Level.SEVERE, null,
					e);
		}

		return line;
	}

	public List<String> readAllLines() {
		List<String> text = new ArrayList<String>();
		String line;

		while ((line = readLine()) != null) {
			text.add(line);
		}

		return text;
	}

	public void close() {
		try {
			in.close();
		} catch (IOException ex) {
			Logger.getLogger(FileUtils.class.getName()).log(Level.SEVERE, null,
					ex);
		}
	}

	public void writeLine(String line) {
		try {
			out.write("\nsue");
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}
