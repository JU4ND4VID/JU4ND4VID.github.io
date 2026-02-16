---
title: "Segundo ejercicio en clase HR Oracle"
pubDate: 2026-02-12
description: "Empleados que viven o trabajan en Europa con salario entre $4,000 y $6,000"
author: "JU4ND4VID"
image:
  url: "https://th.bing.com/th/id/R.dd7a0fff76d029173dcfdf785c9f659b?rik=uhGhd8knM1vaGQ&riu=http%3a%2f%2f1.bp.blogspot.com%2f-tHULGPhK78w%2fTx0c4fpHdNI%2fAAAAAAAAAFk%2fihdejAGfzpQ%2fs1600%2fhrschema.JPG&ehk=aXEwCMWFVIJ0iC5jTOTkCADSnqiZeleqTPHnVWB5spo%3d&risl=&pid=ImgRaw&r=0"
  alt: "Diagrama de SQL JOINs"
---


## Enunciado
Identifique todos los empleados que vivan o trabajen en Europa y tengan un salario entre 4 mil dólares y 6 mil dólares.<br><br>

**Columnas a mostrar:**
1. Nombre y apellidos (una sola columna)
2. País al que pertenece
3. Salario que tiene

<br>

## SQL
```sql
SELECT  e.FIRST_NAME || ' ' || e.LAST_NAME AS nombre_completo,
        c.COUNTRY_NAME AS pais,
        e.SALARY AS salario
FROM    HR.EMPLOYEES e
        JOIN HR.DEPARTMENTS d 
          ON e.DEPARTMENT_ID = d.DEPARTMENT_ID
        JOIN HR.LOCATIONS l 
          ON d.LOCATION_ID = l.LOCATION_ID
        JOIN HR.COUNTRIES c 
          ON l.COUNTRY_ID = c.COUNTRY_ID
        JOIN HR.REGIONS r 
          ON c.REGION_ID = r.REGION_ID
WHERE   r.REGION_NAME = 'Europe'
        AND e.SALARY BETWEEN 4000 AND 6000;
```
<br>

## Porque
Cada JOIN conecta las tablas paso a paso hasta llegar desde el empleado hasta saber en qué región está, para poder filtrar solo los de Europa con salario entre $4K-$6K. NOTA : NO HAY EMPLEADOS CON LOS REQUERIMIENTOS