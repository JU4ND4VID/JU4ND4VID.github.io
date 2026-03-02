---
title: "Test 1 PL/SQL en Oracle"
pubDate: 2026-03-01
description: "Conceptos del Test"
author: "JU4ND4VID"
image:
  url: "/PLSQL.jpg"
  alt: "PL/SQL Oracle"
---

---

## Convenciones de Nomenclatura

**Subprogramas:** `sp_nombreProcedimiento` (máx. 30 caracteres)  
**Variables:** prefijo + camelCase después del guion bajo  
**Constantes:** `cn_nombreConstante`

| Prefijo | Tipo     |
| ------- | -------- |
| `vv_`   | VARCHAR2 |
| `vd_`   | DATE     |
| `vn_`   | NUMBER   |
| `vdo_`  | DOUBLE   |
| `cn_`   | CONSTANT |


<br>

## Estructura del Bloque PL/SQL

<br>

BEGIN y END son los únicos obligatorios
DECLARE y EXCEPTION son opcionales

```sql
DECLARE      -- (1) Opcional: variables, constantes, cursores
BEGIN        -- (2) Obligatorio: lógica ejecutable
EXCEPTION    -- (3) Opcional: manejo de errores
END;         -- (4) Obligatorio: cierre del bloque

```

<br>

## Operadores Clave

| Operador    | Uso               | Ejemplo                 |
| ----------- | ----------------- | ----------------------- |
| :=          | Asignación        | vn_i := vn_i + 1        |
| =           | Comparación       | IF vn_i = 5             |
| IS NULL     | Verificar nulo    | IF p_fecha IS NULL      |
| IS NOT NULL | Verificar no nulo | IF p_nombre IS NOT NULL |

⚠️ Nunca uses = NULL — siempre devuelve FALSE. Usa IS NULL.

<br>

## Control de Flujo IF / ELSIF / ELSE

La condición siempre evalúa booleano (TRUE/FALSE/NULL)

Si es NULL, se comporta como FALSE
<br><br>

## Estructuras de Bucle

```sql
-- FOR: número fijo de veces
FOR vn_i IN 1..5 LOOP
    ...
END LOOP;

-- WHILE: mientras condición sea verdadera
WHILE vn_intentos < 3 LOOP
    vn_intentos := vn_intentos + 1;
END LOOP;

```

<br>
Mecanismos anti-bucle infinito
Contador de intentos con límite máximo
EXIT WHEN condición para salir anticipadamente
<br>

## RETURN en Procedimientos

<br>
RETURN sin valor termina el procedimiento anticipadamente
No lleva valor (a diferencia de las funciones)
Puede aparecer varias veces en el mismo procedimiento
Patrón estándar: asignar mensaje al parámetro OUT → luego RETURN

<br>

```sql
IF vdo_monto < 0 THEN
    vv_mensaje := 'Monto inválido';
    RETURN;   -- sale sin ejecutar más código
END IF;
```

<br>

## Parámetros de Procedimientos

<br>
| Modo   | Dirección                        | Default si no se especifica |
| ------ | -------------------------------- | --------------------------- |
| IN     | Entrada (solo lectura)           | ✅ Sí, es el default         |
| OUT    | Salida (el procedimiento asigna) | ❌                           |
| IN OUT | Entrada y salida                 | ❌                           |

<br>

```sql
CREATE OR REPLACE PROCEDURE sp_ejemplo(
    vv_entrada   IN  VARCHAR2,    -- solo lectura
    vv_salida    OUT VARCHAR2,    -- el proc. le asigna valor
    vdo_mixto    IN OUT NUMBER    -- entrada y salida
) IS
BEGIN
    vv_salida := 'resultado';
END sp_ejemplo;

```

<br>

## SQL Dinámico Nativo

Orden obligatorio: primero INTO, luego USING
<br>
| Cláusula | Dirección | Uso |
| -------- | ------------------- | ---------------------------- |
| INTO | ← Entra al programa | Captura resultado de SELECT |
| USING | → Sale hacia el SQL | Pasa valores a :placeholders |

<br>

```sql
EXECUTE IMMEDIATE <sql_string>
    [INTO <variable>]     -- captura resultado del SELECT
    [USING <valores>];    -- pasa valores a placeholders (:x)


```

<br>
Cuándo usar SQL dinámico

| Situación                        | Solución                          |
| -------------------------------- | --------------------------------- |
| Consulta fija en compilación     | SQL estático (SELECT ... INTO)    |
| Estructura cambia en ejecución   | SQL dinámico (EXECUTE IMMEDIATE)  |
| Valor de filtro variable         | USING con placeholder :x          |
| Nombre de columna/tabla variable | Concatenar + validar lista blanca |

```sql
-- ❌ NO funciona: columnas/tablas no son bind variables
vv_sql := 'SELECT :col FROM empleados';
EXECUTE IMMEDIATE vv_sql USING 'nombre';

-- ✅ Correcto: validar y concatenar
IF vv_col IN ('nombre','salario') THEN
    vv_sql := 'SELECT ' || vv_col || ' FROM empleados WHERE id = :x';
    EXECUTE IMMEDIATE vv_sql INTO vv_resultado USING vn_id;
END IF;
```
