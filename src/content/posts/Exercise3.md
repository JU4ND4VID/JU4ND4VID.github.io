---
title: "Tercer ejercicio en clase HR Oracle"
pubDate: 2026-02-12
description: "Jerarquía organizacional de empleados con emails parcialmente ocultos"
author: "JU4ND4VID"
image:
  url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/img/hierarchical_query_pseudocolumns.gif"
  alt: "Diagrama de consultas jerárquicas Oracle"
---


## Enunciado
Proyectar el orden jerárquico de los cargos de los empleados, mostrar el nombre del empleado y sus jefes, y extraer los emails de ambos (primeras 3 letras, rellenadas con 6 asteriscos a la izquierda).<br><br>


## SQL
```sql
SELECT  LEVEL AS NIVEL,
        LPAD(' ', (LEVEL - 1) * 2) || e.first_name || ' ' || e.last_name AS EMPLEADO,
        LPAD(SUBSTR(e.email, 1, 3), 9, '*') AS EMAIL_EMPLEADO,
        m.first_name || ' ' || m.last_name AS JEFE,
        LPAD(SUBSTR(m.email, 1, 3), 9, '*') AS EMAIL_JEFE
FROM    HR.employees e
        LEFT JOIN HR.employees m
          ON e.manager_id = m.employee_id
START WITH e.manager_id IS NULL
CONNECT BY PRIOR e.employee_id = e.manager_id
ORDER SIBLINGS BY e.last_name;
```
<br>

## Porque
1. LEVEL (Pseudocolumna)
Indica el nivel de profundidad en la jerarquía. El jefe principal tiene LEVEL = 1, sus reportes directos LEVEL = 2, y así sucesivamente. Es como contar cuántos "pisos" hay desde la raíz hasta cada empleado.

2. START WITH (Raíz del árbol)
Define dónde comienza la jerarquía. START WITH e.manager_id IS NULL busca al empleado sin jefe (el CEO o director general), que es la raíz del organigrama.

3. CONNECT BY PRIOR (Relación padre-hijo)
Establece cómo conectar cada nivel con el siguiente. CONNECT BY PRIOR e.employee_id = e.manager_id significa: "conecta cada empleado con aquellos cuyo manager_id sea su employee_id" (encuentra a sus subordinados).

4. LPAD (Relleno a la izquierda)
LPAD(' ', (LEVEL - 1) * 2): Agrega espacios según el nivel para crear indentación visual (jerarquía)

LPAD(SUBSTR(e.email, 1, 3), 9, '*'): Toma las primeras 3 letras del email y rellena con asteriscos a la izquierda hasta completar 9 caracteres (ej: ******JUA)

5. SUBSTR (Subcadena)
SUBSTR(e.email, 1, 3) extrae los primeros 3 caracteres del email (posición 1 a 3).

6. ORDER SIBLINGS BY
Ordena solo los empleados del mismo nivel jerárquico (hermanos) por apellido, sin romper la estructura de árbol.