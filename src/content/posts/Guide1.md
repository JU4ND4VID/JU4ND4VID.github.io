---
title: "Guia 1 de PL/SQL en Oracle"
pubDate: 2026-02-23
description: "Conceptos"
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

## Ejemplo

```sql

SET SERVEROUTPUT ON;

DECLARE
  v_id     NUMBER := 101;
  v_precio NUMBER;
BEGIN
  -- SELECT INTO correcto: TITLE_ID como PK garantiza 1 sola fila
  SELECT PRICE
  INTO   v_precio
  FROM   TITLE
  WHERE  TITLE_ID = v_id;

  DBMS_OUTPUT.PUT_LINE('Precio de TitleID ' || v_id || ': $' || v_precio);

EXCEPTION
  WHEN NO_DATA_FOUND THEN
    -- SELECT INTO no encontró ninguna fila
    DBMS_OUTPUT.PUT_LINE('Error: TitleID ' || v_id || ' no existe.');
  WHEN TOO_MANY_ROWS THEN
    -- SELECT INTO encontró MÁS de una fila ← tu error actual
    DBMS_OUTPUT.PUT_LINE('Error: Hay filas duplicadas para TitleID ' || v_id || '.');
    DBMS_OUTPUT.PUT_LINE('Ejecuta el script de limpieza de duplicados.');
END;

```

<br>

## Subprogramas

Con nombre · Se guardan en BD · Reutilizables · Tienen parámetros

```sql

CREATE OR REPLACE PROCEDURE mostrar_titulos_autor(
  p_author_id IN NUMBER
) AS
  v_nombre VARCHAR2(60);
BEGIN
  SELECT FirstName || ' ' || LastName
  INTO   v_nombre
  FROM   AUTHOR
  WHERE  AuthorID = p_author_id;

  DBMS_OUTPUT.PUT_LINE('Títulos de: ' || v_nombre);

  FOR rec IN (
    SELECT t.TitleName, t.Price
    FROM   TITLE t
    JOIN   TITLEAUTHOR ta ON t.TitleID = ta.TitleID
    WHERE  ta.AuthorID = p_author_id
  ) LOOP
    DBMS_OUTPUT.PUT_LINE('  - ' || rec.TitleName || ' $' || rec.Price);
  END LOOP;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('Autor no encontrado.');
END mostrar_titulos_autor;
/

-- Invocar:
BEGIN
  mostrar_titulos_autor(1);  -- Paul K Tripp → The Call of the While
END;
/



```

<br>

## Funcion

```sql
CREATE OR REPLACE FUNCTION total_ventas_titulo(
  p_title_id IN NUMBER
) RETURN NUMBER AS
  v_total NUMBER(10,2);
BEGIN
  SELECT NVL(SUM(Quantity * ItemPrice), 0)
  INTO   v_total
  FROM   ORDERITEM
  WHERE  TitleID = p_title_id;
  RETURN v_total;
END total_ventas_titulo;
/

-- Invocar en bloque:
BEGIN
  DBMS_OUTPUT.PUT_LINE(total_ventas_titulo(101)); -- 259.05
END;
/

-- Invocar en SQL:
SELECT TitleName, total_ventas_titulo(TitleID) AS TotalVentas
FROM   TITLE
ORDER  BY 2 DESC;


```

<br>

## Triggers

Con nombre · Se guardan en BD · Oracle los ejecuta automáticamente

```sql

-- Tabla de auditoría
CREATE TABLE AUDITORIA_PRECIOS (
  TitleID        NUMBER,
  TitleName      VARCHAR2(50),
  PrecioAnterior NUMBER(5,2),
  PrecioNuevo    NUMBER(5,2),
  FechaCambio    DATE,
  Usuario        VARCHAR2(50)
);

-- Trigger
CREATE OR REPLACE TRIGGER trg_auditoria_precio
BEFORE UPDATE OF Price ON TITLE
FOR EACH ROW
BEGIN
  IF :OLD.Price != :NEW.Price THEN
    INSERT INTO AUDITORIA_PRECIOS VALUES (
      :OLD.TitleID, :OLD.TitleName,
      :OLD.Price,   :NEW.Price,
      SYSDATE,      USER
    );
  END IF;
END;
/
-- Activar (automáticamente al hacer UPDATE):
UPDATE TITLE SET Price = 11.95 WHERE TitleID = 104;
COMMIT;
```

<br>

## Triggers con Validacion

```sql
CREATE OR REPLACE TRIGGER trg_precio_minimo
BEFORE INSERT OR UPDATE OF Price ON TITLE
FOR EACH ROW
BEGIN
  IF :NEW.Price < 1.00 THEN
    RAISE_APPLICATION_ERROR(-20001,
      'Precio mínimo es $1.00. Se intentó: $' || :NEW.Price);
  END IF;
END;
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

| Excepción           | Cuándo ocurre                            |
| ------------------  | ---------------------------------------- |
| NO_DATA_FOUND       | SELECT INTO no devuelve filas            |
| TOO_MANY_ROWS       | SELECT INTO devuelve más de una fila     |
| ZERO_DIVIDE         | División entre cero                      |
| VALUE_ERROR         | Error de conversión o tamaño de variable |
| OTHERS              | Cualquier excepción no manejada arriba   |

<br><br>

## Comandos Esenciales de Entorno

```sql

SET SERVEROUTPUT ON;          -- activar salida de DBMS_OUTPUT
SHOW ERRORS;                  -- ver errores de compilación
DESC TITLE;                   -- ver estructura de una tabla
SELECT * FROM USER_ERRORS;    -- errores de objetos PL/SQL

```
