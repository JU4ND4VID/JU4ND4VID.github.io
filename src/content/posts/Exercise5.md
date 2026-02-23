---
title: "Ejercicos en clase de PL/SQL en Oracle"
pubDate: 2026-02-22
description: "Bloques anónimos, variables, condicionales, GOTO y ciclos LOOP, WHILE y FOR en Oracle PL/SQL"
author: "JU4ND4VID"
image:
  url: "/PLSQL.jpg"
  alt: "PL/SQL Oracle"
---

# Exercise 5 — Introducción a PL/SQL

PL/SQL (**Procedural Language / SQL**) es la extensión de Oracle que permite
combinar SQL con lógica de programación: variables, condicionales y ciclos,
todo dentro de la base de datos.

---

## Estructura de un bloque anónimo

Todo bloque PL/SQL tiene tres secciones:

```sql
DECLARE
    -- Aquí se declaran variables y constantes
BEGIN
    -- Aquí va la lógica del programa
EXCEPTION
    -- (Opcional) Aquí se manejan errores
END;
```
<br>


## Condicional IF — ¿Es hoy un número primo?
```sql

DECLARE
    vn_current_date NUMBER := TO_NUMBER(TO_CHAR(SYSDATE, 'DD'));
BEGIN
    IF vn_current_date IN (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31) THEN
        DBMS_OUTPUT.PUT_LINE('HOLA PRIMO');
    ELSE
        DBMS_OUTPUT.PUT_LINE('NO ES PRIMO');
    END IF;
END;

```

<br>


## GOTO — Salto de etiquetas
```sql

DECLARE
    vn_current_date NUMBER := TO_NUMBER(TO_CHAR(SYSDATE, 'DD'));
BEGIN
    IF vn_current_date IN (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31) THEN
        GOTO primo;
    ELSE
        GOTO noprimo;
    END IF;

    <<primo>>
        DBMS_OUTPUT.PUT_LINE('HOLA PRIMO');
    <<noprimo>>
        DBMS_OUTPUT.PUT_LINE('NO ES PRIMO');
END;


```

<br>


## WHILE LOOP — Serie Fibonacci ≤ 100
```sql

DECLARE
    vn_a NUMBER := 0;
    vn_b NUMBER := 1;
BEGIN
    WHILE vn_a <= 100 LOOP
        DBMS_OUTPUT.PUT_LINE(vn_a);
        vn_b := vn_a + vn_b;
        vn_a := vn_b - vn_a;
    END LOOP;
END;


```

<br>


## WHILE LOOP — Mínimo Común Múltiplo (MCM)
```sql

SET SERVEROUTPUT ON;

DECLARE
    vn_a NUMBER := 12;
    vn_b NUMBER := 16;
    vn_m NUMBER := GREATEST(vn_a, vn_b);
BEGIN
    WHILE MOD(vn_m, LEAST(vn_a, vn_b)) <> 0 LOOP
        vn_m := vn_m + GREATEST(vn_a, vn_b);  
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('MCM: ' || vn_m);
END;


```

<br>


## FOR LOOP — Raíz aproximada de un número
```sql

DECLARE
    vn_b    NUMBER := 8;
    vn_i    NUMBER;
    vn_raiz NUMBER;
BEGIN
    vn_raiz := 0;

    FOR vn_i IN 1..vn_b LOOP
        IF vn_i * vn_i > vn_b THEN
            EXIT;
        END IF;
        vn_raiz := vn_i;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Raíz aproximada de ' || vn_b || ' = ' || vn_raiz);
END;


```