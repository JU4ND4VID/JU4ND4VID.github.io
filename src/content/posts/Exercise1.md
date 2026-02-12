---
title: "Primer ejercicio en clase (HR Oracle)"
pubDate: 2026-02-12
description: "¿Cuántos empleados han pasado por más de un cargo en la compañía?"
author: "JU4ND4VID"
image:
  url: "https://learnsql.com/blog/learn-and-practice-sql-joins/2.png"
  alt: "Diagrama de SQL JOINs"
---

## Enunciado
¿Cuántos empleados han pasado por más de un cargo en la compañía?

## SQL
```sql
SELECT  e.FIRST_NAME || ' ' || e.LAST_NAME AS nombre_completo,
        COUNT(*) AS cantidad_trabajos
FROM    HR.JOB_HISTORY jh
        JOIN HR.EMPLOYEES e 
          ON e.EMPLOYEE_ID = jh.EMPLOYEE_ID
GROUP BY e.EMPLOYEE_ID, e.FIRST_NAME, e.LAST_NAME
HAVING  COUNT(*) >= 2;
