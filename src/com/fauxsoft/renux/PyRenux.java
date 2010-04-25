package com.fauxsoft.renux;

import java.io.FileNotFoundException;
import java.io.FileReader;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.python.core.Py;
import org.python.core.PySystemState;

public class PyRenux {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		PySystemState engineSys = new PySystemState();
		engineSys.path.add(Py.newString("."));
		Py.setSystemState(engineSys);
		ScriptEngine engine = new ScriptEngineManager()
				.getEngineByName("python");
		
		try {
			engine.eval(new FileReader("renux.py"));
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
