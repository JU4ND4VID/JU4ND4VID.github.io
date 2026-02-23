---
title: "Caps 3 & 4 - SELECT y WHERE en Oracle SQL"
pubDate: 2026-02-22
description: "Los fundamentos esenciales de SELECT y WHERE en Oracle SQL: columnas, alias, filtros, operadores y comodines"
author: "JU4ND4VID"
image:
  url: "/logo.png"
  alt: "SELECT y WHERE en Oracle SQL"
---

# Capítulos 3 & 4 — SELECT + WHERE en Oracle SQL


### 1. Una o varias columnas

```sql
-- Una columna
SELECT title_name
FROM TITLE;

-- Varias columnas
SELECT title_name, title_date
FROM TITLE;
```

<br>

### 1. Una o varias columnas

```sql
-- Una columna
SELECT title_name
FROM TITLE;

-- Varias columnas
SELECT title_name, title_date
FROM TITLE;
```

<br>

### 2. Alias con AS -> ESPACIOS = "XX XX XX"

```sql
SELECT title_name  AS "Nombre del Libro",
       title_date  AS "Fecha de Publicación"
FROM TITLE;

```

<br>

### 3. Operadores de comparación

```sql
-- Igual
SELECT title_name
FROM TITLE
WHERE publication_date = DATE '2015-04-30';

-- Mayor / menor
SELECT title_name
FROM TITLE
WHERE price > 5;

-- Diferente (Oracle acepta ambos)
SELECT title_name
FROM TITLE
WHERE price <> 10,95;


```

<br>

### 4. IN

```sql

-- En lugar de: WHERE type = 'F' OR type = 'NF'
SELECT TITLE_NAME, ROYALTY
FROM TITLE
WHERE ROYALTY IN (10, 12, 14);


```

<br>

### 5. LIKE

```sql

-- Títulos que empiecen con "The"
SELECT TITLE_NAME FROM TITLE WHERE TITLE_NAME LIKE 'The%';

-- Títulos que contengan "SQL" en cualquier parte
SELECT TITLE_NAME FROM TITLE WHERE TITLE_NAME LIKE '%SQL%';

```

<br>
