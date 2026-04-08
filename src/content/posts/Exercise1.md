---
title: "Primer ejercicio en clase HR Oracle"
pubDate: 2026-02-12
description: "¿Cuántos empleados han pasado por más de un cargo en la compañía?"
author: "JU4ND4VID"
image:
  url: "https://learnsql.com/blog/learn-and-practice-sql-joins/2.png"
  alt: "Diagrama de SQL JOINs"
---

## Enunciado

¿Cuántos empleados han pasado por más de un cargo en la compañía?

<br>

## SQL
```sql
SELECT  e.FIRST_NAME || ' ' || e.LAST_NAME AS nombre_completo,
        COUNT(*) AS cantidad_trabajos
FROM    HR.JOB_HISTORY jh
        JOIN HR.EMPLOYEES e 
          ON e.EMPLOYEE_ID = jh.EMPLOYEE_ID
GROUP BY e.EMPLOYEE_ID, e.FIRST_NAME, e.LAST_NAME
HAVING  COUNT(*) >= 2;
```
<br>

## Porque
Es un JOIN porque necesitas combinar filas de JOB_HISTORY con la tabla EMPLOYEES usando la clave EMPLOYEE_ID, para obtener el nombre del empleado y contar cuántos registros de historial de cargos tiene.


-- ============================================================
-- TALLER APLICADO 1 - SQL AVANZADO + TRANSACCIONES (ACID)
-- Integrante 1 | Integrante 2 | Curso | Fecha
-- Variante asignada: [VARIANTE] | Tag final: [TAG]_FINAL
-- ============================================================

-- ============================================================
-- ETAPA 0: LEER VARIANTE (nunca usar valores fijos)
-- ============================================================
SELECT *
FROM T1_VARIANTS
WHERE variant_id = '[TU_VARIANTE]';

-- Guardá los valores que usarás abajo como referencia:
-- min_band_gap_pct, max_band_gap_pct, recent_history_months,
-- raise_low_pct, raise_high_pct, max_salary_cap_pct


-- ============================================================
-- ETAPA 1: DIAGNÓSTICO
-- Promedio, máximo, conteo, ranking, distribución y historial
-- ============================================================

-- 1A. Promedio, mínimo, máximo y conteo por departamento
SELECT
    d.department_name,
    COUNT(e.employee_id)            AS total_empleados,
    ROUND(AVG(e.salary), 2)         AS salario_promedio,
    MIN(e.salary)                   AS salario_minimo,
    MAX(e.salary)                   AS salario_maximo
FROM T1_EMPLOYEES e
JOIN T1_DEPARTMENTS d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY d.department_name;

-- 1B. Ranking salarial por departamento con posición en banda
SELECT
    e.employee_id,
    e.first_name || ' ' || e.last_name   AS nombre,
    d.department_name,
    e.job_id,
    e.salary,
    j.min_salary                          AS banda_min,
    j.max_salary                          AS banda_max,
    ROUND((e.salary - j.min_salary)
        / NULLIF(j.max_salary - j.min_salary, 0) * 100, 2) AS pct_dentro_banda,
    RANK() OVER (
        PARTITION BY e.department_id
        ORDER BY e.salary DESC
    )                                     AS ranking_depto
FROM T1_EMPLOYEES e
JOIN T1_DEPARTMENTS d ON e.department_id = d.department_id
JOIN JOBS j           ON e.job_id = j.job_id
ORDER BY d.department_name, ranking_depto;

-- 1C. Empleados con movimiento reciente (ventana desde variante)
SELECT
    h.employee_id,
    e.first_name || ' ' || e.last_name AS nombre,
    h.job_id,
    h.start_date,
    h.end_date
FROM T1_JOB_HISTORY h
JOIN T1_EMPLOYEES e ON h.employee_id = e.employee_id
WHERE h.end_date >= ADD_MONTHS(SYSDATE,
        -(SELECT recent_history_months FROM T1_VARIANTS
          WHERE variant_id = '[TU_VARIANTE]'))
ORDER BY h.employee_id;


-- ============================================================
-- ETAPA 2: DECISIÓN DE ELEGIBILIDAD
-- eligibility_flag, exclusion_reason, raise_pct calculado
-- ============================================================
SELECT
    e.employee_id,
    e.first_name || ' ' || e.last_name                         AS nombre,
    d.department_name,
    e.salary,
    j.min_salary                                                AS banda_min,
    j.max_salary                                                AS banda_max,

    -- Posición porcentual dentro de la banda
    ROUND((e.salary - j.min_salary)
        / NULLIF(j.max_salary - j.min_salary, 0) * 100, 2)     AS pct_banda,

    -- Flag de elegibilidad y porcentaje de aumento
    CASE
        -- Exclusión: departamento excluido por variante
        WHEN e.department_id = (
                SELECT excluded_dept_id FROM T1_VARIANTS
                WHERE variant_id = '[TU_VARIANTE]')
            THEN 'NO'
        -- Exclusión: antigüedad insuficiente
        WHEN MONTHS_BETWEEN(SYSDATE, e.hire_date) / 12
             < (SELECT min_years_seniority FROM T1_VARIANTS
                WHERE variant_id = '[TU_VARIANTE]')
            THEN 'NO'
        -- Exclusión: movimiento reciente en historial
        WHEN EXISTS (
                SELECT 1 FROM T1_JOB_HISTORY h
                WHERE h.employee_id = e.employee_id
                  AND h.end_date >= ADD_MONTHS(SYSDATE,
                        -(SELECT recent_history_months FROM T1_VARIANTS
                          WHERE variant_id = '[TU_VARIANTE]')))
            THEN 'NO'
        -- Elegible extremo inferior de banda
        WHEN (e.salary - j.min_salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN 'SI'
        -- Elegible extremo superior de banda
        WHEN (j.max_salary - e.salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT max_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN 'SI'
        ELSE 'NO'
    END AS eligibility_flag,

    CASE
        WHEN e.department_id = (
                SELECT excluded_dept_id FROM T1_VARIANTS
                WHERE variant_id = '[TU_VARIANTE]')
            THEN 'Departamento excluido por variante'
        WHEN MONTHS_BETWEEN(SYSDATE, e.hire_date) / 12
             < (SELECT min_years_seniority FROM T1_VARIANTS
                WHERE variant_id = '[TU_VARIANTE]')
            THEN 'Antigüedad insuficiente'
        WHEN EXISTS (
                SELECT 1 FROM T1_JOB_HISTORY h
                WHERE h.employee_id = e.employee_id
                  AND h.end_date >= ADD_MONTHS(SYSDATE,
                        -(SELECT recent_history_months FROM T1_VARIANTS
                          WHERE variant_id = '[TU_VARIANTE]')))
            THEN 'Movimiento reciente en historial'
        WHEN (e.salary - j.min_salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN 'Elegible - extremo inferior de banda'
        WHEN (j.max_salary - e.salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT max_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN 'Elegible - extremo superior de banda'
        ELSE 'No cumple condiciones de banda'
    END AS exclusion_reason,

    -- Porcentaje de aumento a aplicar
    CASE
        WHEN (e.salary - j.min_salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN (SELECT raise_low_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]')
        WHEN (j.max_salary - e.salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT max_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN (SELECT raise_high_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]')
        ELSE 0
    END AS raise_pct

FROM T1_EMPLOYEES e
JOIN T1_DEPARTMENTS d ON e.department_id = d.department_id
JOIN JOBS j           ON e.job_id = j.job_id
ORDER BY eligibility_flag DESC, d.department_name;


-- ============================================================
-- ETAPA 3: PREVALIDACIÓN DEL IMPACTO
-- impacted_rows, total antes y después, verificación de topes
-- ============================================================
WITH elegibles AS (
    SELECT
        e.employee_id,
        e.salary                                               AS salary_before,
        j.min_salary,
        j.max_salary,
        CASE
            WHEN (e.salary - j.min_salary)
                 / NULLIF(j.max_salary - j.min_salary, 0) * 100
                 <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                     WHERE variant_id = '[TU_VARIANTE]')
                THEN (SELECT raise_low_pct  FROM T1_VARIANTS
                      WHERE variant_id = '[TU_VARIANTE]') / 100
            ELSE (SELECT raise_high_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]') / 100
        END AS factor
    FROM T1_EMPLOYEES e
    JOIN JOBS j ON e.job_id = j.job_id
    -- Replica exacta de los filtros de la Etapa 2 (solo elegibles = SI)
    WHERE e.department_id != (
            SELECT excluded_dept_id FROM T1_VARIANTS
            WHERE variant_id = '[TU_VARIANTE]')
      AND MONTHS_BETWEEN(SYSDATE, e.hire_date) / 12
          >= (SELECT min_years_seniority FROM T1_VARIANTS
              WHERE variant_id = '[TU_VARIANTE]')
      AND NOT EXISTS (
              SELECT 1 FROM T1_JOB_HISTORY h
              WHERE h.employee_id = e.employee_id
                AND h.end_date >= ADD_MONTHS(SYSDATE,
                        -(SELECT recent_history_months FROM T1_VARIANTS
                          WHERE variant_id = '[TU_VARIANTE]')))
      AND (
              (e.salary - j.min_salary)
              / NULLIF(j.max_salary - j.min_salary, 0) * 100
              <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]')
           OR (j.max_salary - e.salary)
              / NULLIF(j.max_salary - j.min_salary, 0) * 100
              <= (SELECT max_band_gap_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]')
          )
),
impacto AS (
    SELECT
        employee_id,
        salary_before,
        LEAST(
            ROUND(salary_before * (1 + factor), 2),
            (SELECT max_salary_cap_pct FROM T1_VARIANTS
             WHERE variant_id = '[TU_VARIANTE]') / 100 * max_salary
        )                                                       AS salary_after
    FROM elegibles
)
SELECT
    COUNT(*)                           AS impacted_rows,
    ROUND(SUM(salary_before), 2)       AS total_salary_before,
    ROUND(SUM(salary_after), 2)        AS total_salary_after,
    ROUND(SUM(salary_after)
        - SUM(salary_before), 2)       AS total_incremento,
    ROUND((SUM(salary_after)
        - SUM(salary_before))
        / SUM(salary_before) * 100, 2) AS pct_incremento_global
FROM impacto;


-- ============================================================
-- ETAPA 4: EJECUCIÓN CON CONTROL TRANSACCIONAL
-- SAVEPOINT → UPDATE → AUDITORÍA → validar topes → COMMIT
-- ============================================================

-- Punto de restauración antes de cualquier cambio
SAVEPOINT antes_ajuste_salarial;

-- Actualización controlada
UPDATE T1_EMPLOYEES e
SET e.salary = LEAST(
    ROUND(e.salary * (1 + (
        CASE
            WHEN (e.salary - (SELECT j.min_salary FROM JOBS j
                              WHERE j.job_id = e.job_id))
                 / NULLIF((SELECT j.max_salary - j.min_salary FROM JOBS j
                           WHERE j.job_id = e.job_id), 0) * 100
                 <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                     WHERE variant_id = '[TU_VARIANTE]')
                THEN (SELECT raise_low_pct  FROM T1_VARIANTS
                      WHERE variant_id = '[TU_VARIANTE]') / 100
            ELSE (SELECT raise_high_pct FROM T1_VARIANTS
                  WHERE variant_id = '[TU_VARIANTE]') / 100
        END
    )), 2),
    -- Tope: no superar max_salary_cap_pct del máximo de banda
    (SELECT j.max_salary FROM JOBS j WHERE j.job_id = e.job_id)
    * (SELECT max_salary_cap_pct FROM T1_VARIANTS
       WHERE variant_id = '[TU_VARIANTE]') / 100
)
WHERE e.department_id != (
        SELECT excluded_dept_id FROM T1_VARIANTS
        WHERE variant_id = '[TU_VARIANTE]')
  AND MONTHS_BETWEEN(SYSDATE, e.hire_date) / 12
      >= (SELECT min_years_seniority FROM T1_VARIANTS
          WHERE variant_id = '[TU_VARIANTE]')
  AND NOT EXISTS (
          SELECT 1 FROM T1_JOB_HISTORY h
          WHERE h.employee_id = e.employee_id
            AND h.end_date >= ADD_MONTHS(SYSDATE,
                    -(SELECT recent_history_months FROM T1_VARIANTS
                      WHERE variant_id = '[TU_VARIANTE]')))
  AND (
          (e.salary - (SELECT j.min_salary FROM JOBS j
                       WHERE j.job_id = e.job_id))
          / NULLIF((SELECT j.max_salary - j.min_salary FROM JOBS j
                    WHERE j.job_id = e.job_id), 0) * 100
          <= (SELECT min_band_gap_pct FROM T1_VARIANTS
              WHERE variant_id = '[TU_VARIANTE]')
       OR ((SELECT j.max_salary FROM JOBS j WHERE j.job_id = e.job_id) - e.salary)
          / NULLIF((SELECT j.max_salary - j.min_salary FROM JOBS j
                    WHERE j.job_id = e.job_id), 0) * 100
          <= (SELECT max_band_gap_pct FROM T1_VARIANTS
              WHERE variant_id = '[TU_VARIANTE]')
      );

-- Registrar auditoría de los cambios realizados
INSERT INTO AUDIT_SALARY_ADJUSTMENTS_T1 (
    employee_id,
    salary_before,
    salary_after,
    variant_id,
    applied_rule,
    execution_user,
    execution_date,
    execution_tag
)
SELECT
    e.employee_id,
    e.salary                            AS salary_before,   -- valor previo al UPDATE
    e.salary                            AS salary_after,    -- valor post UPDATE
    '[TU_VARIANTE]',
    CASE
        WHEN (e.salary - j.min_salary)
             / NULLIF(j.max_salary - j.min_salary, 0) * 100
             <= (SELECT min_band_gap_pct FROM T1_VARIANTS
                 WHERE variant_id = '[TU_VARIANTE]')
            THEN 'Ajuste extremo inferior de banda'
        ELSE 'Ajuste extremo superior de banda'
    END,
    USER,
    SYSDATE,
    '[TAG]_FINAL'
FROM T1_EMPLOYEES e
JOIN JOBS j ON e.job_id = j.job_id
WHERE e.department_id != (
        SELECT excluded_dept_id FROM T1_VARIANTS
        WHERE variant_id = '[TU_VARIANTE]')
  AND MONTHS_BETWEEN(SYSDATE, e.hire_date) / 12
      >= (SELECT min_years_seniority FROM T1_VARIANTS
          WHERE variant_id = '[TU_VARIANTE]')
  AND NOT EXISTS (
          SELECT 1 FROM T1_JOB_HISTORY h
          WHERE h.employee_id = e.employee_id
            AND h.end_date >= ADD_MONTHS(SYSDATE,
                    -(SELECT recent_history_months FROM T1_VARIANTS
                      WHERE variant_id = '[TU_VARIANTE]')))
  AND (
          (e.salary - j.min_salary)
          / NULLIF(j.max_salary - j.min_salary, 0) * 100
          <= (SELECT min_band_gap_pct FROM T1_VARIANTS
              WHERE variant_id = '[TU_VARIANTE]')
       OR (j.max_salary - e.salary)
          / NULLIF(j.max_salary - j.min_salary, 0) * 100
          <= (SELECT max_band_gap_pct FROM T1_VARIANTS
              WHERE variant_id = '[TU_VARIANTE]')
      );

-- COMMIT solo si la validación de topes está limpia (ver Etapa 5)
-- Si algo falla: ROLLBACK TO SAVEPOINT antes_ajuste_salarial;
COMMIT;


-- ============================================================
-- ETAPA 5: VALIDACIÓN FINAL
-- Verificar topes, auditoría de la corrida final, consistencia
-- ============================================================

-- 5A. Empleados impactados con salario antes y después
SELECT
    a.employee_id,
    e.first_name || ' ' || e.last_name AS nombre,
    a.salary_before,
    a.salary_after,
    ROUND(a.salary_after - a.salary_before, 2)         AS incremento,
    ROUND((a.salary_after - a.salary_before)
          / a.salary_before * 100, 2)                  AS pct_aumento,
    a.applied_rule,
    a.execution_tag
FROM AUDIT_SALARY_ADJUSTMENTS_T1 a
JOIN T1_EMPLOYEES e ON a.employee_id = e.employee_id
WHERE a.execution_tag = '[TAG]_FINAL'
ORDER BY a.employee_id;

-- 5B. Verificar que ningún salario supera el tope de banda
SELECT
    e.employee_id,
    e.salary                                                   AS salary_actual,
    j.max_salary * (SELECT max_salary_cap_pct FROM T1_VARIANTS
                    WHERE variant_id = '[TU_VARIANTE]') / 100  AS tope_permitido,
    CASE
        WHEN e.salary > j.max_salary
             * (SELECT max_salary_cap_pct FROM T1_VARIANTS
                WHERE variant_id = '[TU_VARIANTE]') / 100
            THEN '*** SUPERA TOPE ***'
        ELSE 'OK'
    END AS estado_tope
FROM T1_EMPLOYEES e
JOIN JOBS j ON e.job_id = j.job_id
WHERE e.employee_id IN (
    SELECT employee_id FROM AUDIT_SALARY_ADJUSTMENTS_T1
    WHERE execution_tag = '[TAG]_FINAL'
);

-- 5C. Resumen de consistencia final de la corrida
SELECT
    COUNT(*)                             AS filas_auditadas,
    ROUND(SUM(salary_before), 2)         AS masa_salarial_antes,
    ROUND(SUM(salary_after), 2)          AS masa_salarial_despues,
    ROUND(SUM(salary_after)
        - SUM(salary_before), 2)         AS delta_total,
    execution_tag
FROM AUDIT_SALARY_ADJUSTMENTS_T1
WHERE execution_tag = '[TAG]_FINAL'
GROUP BY execution_tag;