---
title: "PL/SQL en Oracle"
pubDate: 2026-02-23
description: "Subprogramas"
author: "JU4ND4VID"
image:
  url: "/PLSQL.jpg"
  alt: "PL/SQL Oracle"
---

---

<br>
Bloque anónimo = temporal, no reutilizable
Subprograma = permanente, tú lo llamas
Trigger = permanente, Oracle lo llama solo
Bind variable = seguridad + rendimiento (siempre usar en SQL dinámico)
<br><br>

# BLIND VARIABLES

<br>
Oracle analiza (parsea) cada sentencia SQL y genera un plan de ejecución. Si el valor va literal, cada llamada
es una sentencia nueva → más trabajo.
Con bind variable → una sola sentencia, N ejecuciones

```sql

SELECT Price FROM TITLE WHERE TitleID = 101  -- sentencia 1
SELECT Price FROM TITLE WHERE TitleID = 102  -- sentencia 2
SELECT Price FROM TITLE WHERE TitleID = 103  -- sentencia 3

SELECT Price FROM TITLE WHERE TitleID = :1   -- reutiliza el plan

```

<br>

## SUBPROGRAMA

```sql

SET SERVEROUTPUT ON;

CREATE OR REPLACE PROCEDURE sp_saludoNombre (param_nombre IN VARCHAR2)
/*
Autor: Juan Peña
Fecha: Feb 23/02/2026
Descripcion: Este SP crea un mensaje personalizado como saludo
*/
IS
    vv_mensaje VARCHAR2(100);
BEGIN
    vv_mensaje := 'Hola  ' || param_nombre || ' tu papá' ;
    dbms_output.put_line(vv_mensaje);
END sp_saludoNombre;
/


```

<br>

Con nombre · Se guardan en BD · Reutilizables · Tienen parámetros
<br>

BUENAS PRACTICAS: COMENTAR ANTES DE IS, USAR NOMENCLATURA Y TERMINAR CON /
<br>
SE LLAMA DESDE UN BLOQUE ANONIMO

## Funcion

```sql
BEGIN
    sp_saludoNombre('Wilsoon');
END;
/

```

<br>

<br>

## ULTIMO VIERNES

```sql
CREATE OR REPLACE PROCEDURE sp_saludar (param_nombre IN VARCHAR2 DEFAULT 'Ingeniero', param_fecha IN DATE DEFAULT SYSDATE)
/*
AUTOR: Juan Peña
FECHA: 23/02/2026
DESCRIPCIÓN: Este sp genera un texto saludando a alguien y le dice el ultimo viernes del mes.
*/
IS -- o AS (da igual)
vv_textoConcatenado VARCHAR2(100);
vd_ultimoViernes DATE;

BEGIN
vv_textoConcatenado := 'Hola, ' || param_nombre || ' tu papá ';
dbms_output.put_line(vv_textoConcatenado);

 vd_ultimoViernes := NEXT_DAY(LAST_DAY(param_fecha) - 7, 'VIERNES');
 dbms_output.put_line ('El ultimo viernes es ' || vd_ultimoViernes);

END sp_saludar;
/
```

<br><br>

## Principal

| Característica          | Descripción                                                    |
| ----------------------- | -------------------------------------------------------------- |
| Error Handling          | Sección EXCEPTION captura errores en tiempo de ejecución       |
| Variables/Constantes    | DECLARE v_x NUMBER; c_iva CONSTANT NUMBER := 0.19;             |
| %TYPE / %ROWTYPE        | Adaptan tipo al esquema: employees.salary%TYPE                 |
| Cursores                | Puntero a resultado SQL: implícito (auto) o explícito (manual) |
| Paquetes                | Agrupan procedimientos, funciones y variables relacionados     |
| I/O principal           | DBMS_OUTPUT.PUT_LINE() para debug/salida en consola            |
| Compilación condicional | $IF $$DEBUG $THEN ... $END — activa código por flag            |
| Cursor FOR LOOP         | Procesa filas una a una sin OPEN/FETCH/CLOSE manual            |

<br><br>

## Excepciones Predefinidas Frecuentes

| Excepción     | Cuándo ocurre                            |
| ------------- | ---------------------------------------- |
| NO_DATA_FOUND | SELECT INTO no devuelve filas            |
| TOO_MANY_ROWS | SELECT INTO devuelve más de una fila     |
| ZERO_DIVIDE   | División entre cero                      |
| VALUE_ERROR   | Error de conversión o tamaño de variable |
| OTHERS        | Cualquier excepción no manejada arriba   |

<br><br>

## Comandos Esenciales de Entorno

```sql

SET SERVEROUTPUT ON;          -- activar salida de DBMS_OUTPUT
SHOW ERRORS;                  -- ver errores de compilación
DESC TITLE;                   -- ver estructura de una tabla
SELECT * FROM USER_ERRORS;    -- errores de objetos PL/SQL

```
