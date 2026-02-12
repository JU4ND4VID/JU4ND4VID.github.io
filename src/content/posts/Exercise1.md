---
title: "Joins básicos en SQL"
pubDate: 2026-02-12
description: "Ejemplos de INNER/LEFT JOIN."
author: "JU4ND4VID"
image:
  url: "/images/sql.jpg"
  alt: "SQL"
---

```sql
SELECT e.nombre, d.nombre
FROM empleados e
JOIN departamentos d ON d.id = e.depto_id;

