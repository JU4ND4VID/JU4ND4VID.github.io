---
title: "Cuarto ejercicio - Creación e Inserción de Datos en Oracle"
pubDate: 2026-02-22
description: "Creación de tablas, inserción de datos con INSERT ALL y copia de tablas en Oracle SQL"
author: "JU4ND4VID"
image:
  url: "/logo.png"
  alt: "Creación de tablas e inserción de datos en Oracle"
---



## Enunciado
1 Capitulo del libro de MySQL a Oracle y una copia de tabla desde `HR.EMPLOYEES`.<br><br>



## SQL

### Crear tabla
```sql
CREATE TABLE Promotion (
    PromotionID       NUMBER(10)    NOT NULL,
    PromotionCode     VARCHAR2(10)  NOT NULL,
    PromotionStartDate DATE         NOT NULL,
    PromotionEndDate   DATE         NOT NULL
);
```
<br>

### Insertar Registros
```sql
INSERT ALL
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate)
    VALUES (1, '2OFF2015', TO_DATE('2011-11-01','YYYY-MM-DD'), TO_DATE('2011-11-30','YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate)
    VALUES (2, '2OFF2016', TO_DATE('2012-11-01','YYYY-MM-DD'), TO_DATE('2012-11-30','YYYY-MM-DD'))
    INTO Promotion (PromotionID, PromotionCode, PromotionStartDate, PromotionEndDate)
    VALUES (3, '2OFF2017', TO_DATE('2013-11-01','YYYY-MM-DD'), TO_DATE('2013-11-30','YYYY-MM-DD'))
SELECT * FROM DUAL;
```

<br>

### Insertar Registros
```sql
CREATE TABLE EMPLOYEES_COPIA AS
SELECT * FROM HR.EMPLOYEES;
```

<br>


### Cambiar una columan de nombre
```sql
ALTER TABLE TITLE
RENAME COLUMN titlename TO title_name;
```

<br>


## Importante

| SQL Server / MySQL | Oracle      |
| ------------------ | ----------- |
| int                | NUMBER(10)  |
| varchar(n)         | VARCHAR2(n) |
| datetime           | DATE        |
| decimal(p,s)       | NUMBER(p,s) |

INSERT ALL, que permite declarar múltiples bloques INTO en una sola sentencia
VARCHAR2 Hasta 4000 bytes, Optimizado y seguro <- Recomendada