# Plan de estudio: Analista comercial / inventarios (La Confianza)

**Candidato:** Ingeniero en Sistemas (UNA) · Automation Testing Intern, Cargill (feb–nov 2022) · Informatics Engineer, Astrix / Sapio–Java (feb 2023–jul 2025)  
**Duración:** 12 días · **Ritmo:** ~2 horas/día (~24 h totales)  
**Meta:** Postular con vocabulario sólido, un caso en Google Sheets, CV actualizado y respuestas claras en entrevista.  
**Idioma de estudio:** mezcla ES/EN (conceptos en español; algunos videos técnicos en inglés).  
**Archivos relacionados:**
- CV borrador: [`la-confianza-cv.md`](la-confianza-cv.md)
- Este plan: `la-confianza-plan-estudio.md`

---

## Tu ventaja (y tu hueco)

| Ya traes (Astrix / Cargill / UNA) | Debes construir en estos 12 días |
|---|---|
| Diagnóstico con datos incompletos | Vocabulario de inventario y margen |
| Análisis reproducible (testing: esperado vs real) | Google Sheets a nivel pivots + escenarios |
| Explicar problemas técnicos a no técnicos | Recomendaciones comerciales con impacto/riesgo |
| Seguimiento post-fix (¿se resolvió?) | Seguimiento post-decisión de compra/rebaja/traslado |
| Sistemas y lógica (Java, calidad) | Shopify a nivel conversacional (no admin avanzado) |

**Narrativa central del proceso:**  
> “No vengo de retail. Vengo de diagnosticar sistemas y procesos con evidencia, documentar supuestos y dar seguimiento. Ese mismo ciclo lo aplico a ventas e inventario en Sheets.”

---

## Cómo usar este plan

1. Haz **video → práctica → entregable** el mismo día. No acumules solo videos.
2. Trabaja en **Google Sheets** (lo piden explícitamente). Excel sirve igual.
3. Carpeta Drive: `La-Confianza/` con:
   - `01-Glosario`
   - `02-Caso-inventario` (Sheet principal)
   - `03-Memo-recomendaciones`
   - `04-Entrevista`
   - `05-CV` (copia de trabajo del archivo local)
4. Regla de oro del puesto: **si falta dato, dilo; no inventes conclusiones.**
5. Cada día, anota **1 puente** Astrix/Cargill → el tema del día (1–2 frases). Te servirá en entrevista.

### Checklist global (listo para postular)

- [ ] Explicas cada KPI del glosario en ≤60 segundos
- [ ] Sheet con pestañas: Datos, Diccionario, KPIs, Alertas, Escenarios, Recomendaciones, Seguimiento
- [ ] ≥3 recomendaciones con impacto, riesgo y métrica de seguimiento
- [ ] 10 respuestas de entrevista ensayadas en voz alta (incluye puente Astrix/Cargill)
- [ ] CV actualizado con cifras reales del caso ([`la-confianza-cv.md`](la-confianza-cv.md))
- [ ] Carta corta pegada al mecanismo de postulación

---

## Día 0 — Setup personalizado (30–45 min)

### Hacer
- Crear carpeta Drive y Sheet vacío del caso
- Abrir [`la-confianza-cv.md`](la-confianza-cv.md) y completar: nombre exacto, teléfono, correo, nivel de inglés
- Anotar 3 logros cuantificables si los tienes (tickets/mes en Astrix, bugs en Cargill, etc.) — si no, sigue sin inventar
- Reservar 2 h/día en calendario

### Lectura rápida
- Descripción del puesto: “analizar → recomendar → dar seguimiento” (tú no decides compra/rebaja; lo hace Gerencia Comercial)

### Entregable
Nota de 5 líneas: “por qué un ingeniero de sistemas/soporte Sapio puede aportar aquí” (usa la narrativa central de arriba).

---

## Días 1–3 — Vocabulario comercial e inventario

### Día 1 — Margen, COGS, rotación, días de inventario (~2 h)

#### Videos / lecturas
1. **Matemáticas de retail (Shopify, ES)** — margen, rotación, GMROI  
   https://www.shopify.com/es/blog/matematicas-en-retail
2. **Inventory turnover (Investopedia, EN)**  
   https://www.investopedia.com/terms/i/inventoryturnover.asp
3. **KPIs de inventario e-commerce (EN)**  
   https://omniorders.com/blog/inventory-kpis-ecommerce

#### Fórmulas a memorizar
| KPI | Fórmula | Pregunta que responde |
|---|---|---|
| Margen bruto % | `(Precio − Costo) / Precio` | ¿Cuánto gano por cada ₡ vendido? |
| Rotación | `COGS / Inventario promedio` | ¿Cuántas veces vendo y repongo el stock? |
| Días de inventario (DIO) | `365 / Rotación` (o `Inventario / venta diaria`) | ¿Cuántos días me dura el stock? |

#### Práctica (45 min)
En Sheets: 5 productos con costo, precio, inventario inicial/final, COGS del mes. Calcula margen, rotación y días de inventario.

#### Puente del día
- **Astrix:** “En Sapio medía si un fix mejoró el síntoma; aquí mido si el stock/margen mejoró tras una acción.”

#### Entregable
Pestaña `Glosario` con esas 3 métricas: fórmula + ejemplo + “si sube/baja, qué hago”.

---

### Día 2 — Sell-through, quiebre, exceso, envejecido (~2 h)

#### Videos / lecturas
1. **Sell-through formula guide (EN)**  
   https://www.cleverence.com/articles/for-business/sell-thru-formula-5724/
2. **Retail metrics guide (EN)**  
   https://www.agrinventory.com/blog/retail-metrics-guide/
3. **Markdown / rebajas (ES)**  
   https://www.databricks.com/es/blog/retail-markdown-optimization-reactive-markdowns-proactive

#### Conceptos clave
- **Sell-through** = unidades vendidas / unidades recibidas (o disponibles) en el periodo
- **Quiebre** = stock insuficiente/cero y se deja de vender
- **Exceso** = mucha cobertura vs. ritmo de venta
- **Envejecido** = stock sin rotar / temporada pasada
- **Markdown** = rebaja para acelerar salida (protege caja, puede dañar margen)

#### Práctica (45 min)
Clasifica tus 5 productos: quiebre / sano / exceso / candidato a rebaja. 1 acción por cada uno.

#### Puente del día
- **Cargill:** “En testing clasificaba severidad (blocker vs minor). Aquí clasifico alertas de inventario por urgencia comercial.”

#### Entregable
Glosario ampliado + tabla de clasificación.

---

### Día 3 — Forecast, escenarios y supuestos (~2 h)

#### Lecturas
1. https://www.shopify.com/es/blog/matematicas-en-retail  
2. Pide a una IA que te explique “moving average forecast for retail” y **valida** en tu Sheet

#### Qué debes saber explicar
- Forecast ≠ verdad; es estimación con supuestos
- Escenarios: **base / optimista / pesimista**
- Documentar: dato usado, supuesto, vacío
- Comparar forecast vs. real después (igual que expected vs actual en testing)

#### Práctica (60 min)
Para 1 categoría: venta 4 semanas, inventario proyectado, 3 escenarios (±20%), supuestos escritos.

#### Puente del día
- **Cargill + Astrix:** “Un escenario es como un caso de prueba con datos de entrada distintos; el supuesto es el precondition.”

#### Entregable
Pestaña `Escenarios` + 5 supuestos.

**Cierre días 1–3:** grábate 3 min explicando rotación, sell-through y por qué una rebaja puede ser correcta aunque baje el margen.

---

## Días 4–7 — Google Sheets al nivel del puesto

### Día 4 — Datos limpios + estructura tabular (~2 h)

#### Videos
1. **Google Sheets Advanced Tutorial (EN)** — primeros ~40 min + filtros  
   https://www.youtube.com/watch?v=t0B0Tgz0b-0

#### Dataset del caso (retail pequeño, inspirado en operación multi-ubicación)
**`Ventas`** (≥120 filas / 8 semanas): fecha, sku, producto, categoria, proveedor, ubicacion (Tienda Grecia / Tienda 2 / CEDI / Web), canal, unidades, precio_unit, costo_unit, ingreso, costo_total, margen  

**`Inventario`** (snapshot semanal): semana, sku, ubicacion, stock_unidades, costo_unit, valor_inventario, dias_sin_movimiento  

**`Diccionario`:** definición de cada columna + unidades + fuente ficticia

#### Reglas de calidad (mentalidad testing)
- Sin celdas combinadas en datos
- 1 fila = 1 hecho
- Detecta nulos, negativos, SKUs huérfanos (como bugs de datos)

#### Puente del día
- **Cargill:** “Datos sucios = tests flaky. Primero estabilizo la base, luego analizo.”

#### Entregable
Datos cargados + lista de 5 anomalías (puedes insertarlas a propósito).

---

### Día 5 — Cruces: XLOOKUP / BUSCARV (~2 h)

#### Videos / guías
1. https://coefficient.io/google-sheet-xlookup  
2. https://infoinspired.com/google-docs/spreadsheet/vlookup-and-xlookup-key-differences-in-google-sheets/  
3. Capítulo VLOOKUP del tutorial: https://www.youtube.com/watch?v=t0B0Tgz0b-0 (~1:00:39)

#### Práctica
- Cruzar ventas con maestro de producto
- Traer stock a desempeño por SKU
- `IFNA` → “SKU sin maestro” (dato incompleto declarado)

#### Puente del día
- **Astrix:** “Un join fallido en Sheets es como una referencia rota en Sapio: se reporta, no se inventa.”

#### Entregable
Tabla `Desempeño_SKU`: ventas, ingreso, margen %, stock, días de cobertura.

---

### Día 6 — Tablas dinámicas (~2 h)

#### Videos
1. https://www.youtube.com/watch?v=dmPzbR_1QsY  
2. https://www.youtube.com/watch?v=uX0n3i2f7co (ES)  
3. https://juansguzman.com/como-crear-tu-primera-tabla-dinamica-en-google-sheets/  
4. Capítulo pivot: https://www.youtube.com/watch?v=t0B0Tgz0b-0 (~35:30)

#### Pivots obligatorios
1. Ventas/ingreso por categoria × semana  
2. Unidades y margen por proveedor  
3. Stock y ventas por ubicacion  
4. Top 10 ingreso / bottom 10 rotación o sell-through  

#### Entregable
Pestaña `KPIs` con esos 4 pivots.

---

### Día 7 — Alertas, escenarios y visualización (~2 h)

#### Alertas automáticas
- Quiebre: stock = 0 y venta histórica > 0  
- Exceso: cobertura > umbral (ej. 90 días)  
- Sell-through bajo (ej. < 40% en 8 semanas)  
- Margen deteriorado  
- Anomalía: precio < costo, negativos, SKU sin maestro  

Máximo **3 gráficos**, una pregunta cada uno.

#### Puente del día
- **Astrix:** “Alertas = severidad de incidente. No todo es P1; priorizo lo que protege margen o ventas perdidas.”

#### Entregable
Sheet usable por un tercero sin explicarte.

**Cierre días 4–7:** pide a una IA que audite el Sheet: “¿se entiende cómo se calculó cada KPI?”

---

## Días 8–10 — De análisis a recomendación

### Día 8 — Framework de recomendación (~2 h)

#### Lecturas
- https://www.databricks.com/es/blog/retail-markdown-optimization-reactive-markdowns-proactive  
- https://v10labs.com/control-stock-retail  

#### Plantilla (pestaña `Recomendaciones`)

| Campo | Ejemplo |
|---|---|
| Hallazgo | SKU-12: 140 días de cobertura, sell-through 18% |
| Acción | Markdown 20% en Tienda Grecia + no reponer |
| Impacto esperado | Cobertura ~60 días; liberar ₡X; margen −Y pts |
| Riesgo | Canibalizar SKU similar |
| Datos faltantes | ¿Fin de temporada en 3 semanas? |
| Seguimiento (14 días) | Unidades, margen real, stock remanente |

#### Práctica
**3 recomendaciones** completas (reposición, traslado, rebaja/salida).

#### Puente del día
- **Astrix:** “Recomendación ≠ decisión. En soporte yo proponía el fix; el owner aprobaba. Aquí Comercial decide.”

#### Entregable
3 filas perfectas en `Recomendaciones`.

---

### Día 9 — Caso completo: 5–8 acciones (~2 h)

Cubre: 1 quiebre/reposición · 1 traslado · 1 exceso→rebaja · 1 baja rotación→no comprar · 1 anomalía de datos (no recomendar compra hasta limpiar).

#### Entregable
Memo 1 página (`03-Memo-recomendaciones`): contexto, 3 hallazgos, acciones, qué NO se puede concluir aún.

---

### Día 10 — Seguimiento post-decisión (~2 h)

Pestaña `Seguimiento`: decisión, KPI antes, meta 14/30 días, KPI real (simula 1 bueno y 1 malo), aprendizaje del supuesto.

#### Puente del día
- **Cargill:** “Regression testing = ¿la decisión sigue funcionando dos semanas después?”

#### Entregable
Historia completa de **1 decisión**: antes → acción → después.

**Cierre días 8–10:** pitch de 5 min: “3 recomendaciones para Gerencia Comercial”.

---

## Días 11–12 — Shopify, IA, entrevista y CV

### Día 11 — Shopify (~2 h)

#### Videos
1. https://www.youtube.com/watch?v=OVq98oa2ILI  
2. https://www.youtube.com/watch?v=Ncr9u4NBb6Y  

#### Lecturas
1. https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/inventory-reports  
2. https://www.identixweb.com/how-to-pull-a-shopify-inventory-report/  

#### Guion honesto (tu perfil)
- No has administrado Shopify en producción.
- Sí entiendes: ventas, variantes, ubicaciones, export CSV, reportes de inventario/sell-through.
- Flujo: `Shopify/ERP → CSV → Sheets → Alertas → Recomendación → Seguimiento`.
- Analogía: Shopify/Sapio son sistemas fuente; tú analizas la salida y recomiendas.

#### Entregable
Media página: “Cómo usaría Shopify en este puesto”.

---

### Día 12 — IA + entrevista + cerrar CV (~2 h)

#### Protocolo de IA
1. Borrador con IA → 2. Validar en Sheets → 3. Documentar supuestos → 4. No subir datos sensibles reales → 5. Detectar KPIs inventados porque sabes la fórmula

#### Ejercicio IA (30 min)
Pega extracto anónimo del Sheet: “Detecta excesos/quiebres; no inventes filas; 3 acciones con impacto/riesgo”. Corrige a mano.

#### 10 preguntas — guías de respuesta para ti

1. **Días de inventario** — fórmula + “habilita comprar menos / trasladar / rebajar”.
2. **Sell-through vs rotación** — % de un lote vs veces que ciclas stock.
3. **Buen margen, no rota** — exceso/envejecido; markdown o salida; proteger caja.
4. **Quiebre A / exceso B** — traslado primero; comprar solo si el sistema sigue corto.
5. **Falta costo** — no inventar margen; declarar vacío; pedir dato a Comercial/finanzas.
6. **Modelo Sheets en 2 min** — Datos → Diccionario → KPIs → Alertas → Recomendaciones → Seguimiento.
7. **IA** — explorar/documentar; validación humana; no datos sensibles.
8. **¿Por qué tú sin retail?** —  
   > “Ingeniero UNA; Cargill (testing auditable); Astrix/Sapio (diagnóstico, stakeholders, seguimiento). Completé caso en Sheets con KPIs y recomendaciones. Aprendo Shopify rápido; el criterio analítico ya lo practico.”
9. **Seguimiento** — cuenta tu decisión simulada del Día 10 (antes/después).
10. **Influir sin autoridad** —  
    > “En Astrix priorizaba con evidencia e impacto. Aquí traigo el número, el supuesto y el riesgo; Comercial decide.”

#### Cerrar CV (30 min)
1. Abre [`la-confianza-cv.md`](la-confianza-cv.md)  
2. Actualiza **Proyecto destacado** con cifras reales de tu Sheet (SKUs, semanas, # recomendaciones)  
3. Completa contacto + inglés  
4. Copia a Docs/PDF 1 página  
5. Ten lista la carta corta del mismo archivo  

#### Entregable
- `04-Entrevista` con respuestas cortas  
- Ensayo en voz alta de #1, #3, #8  
- CV PDF listo para postular  

---

## Recursos imprescindibles

| Recurso | Para qué |
|---|---|
| https://www.shopify.com/es/blog/matematicas-en-retail | Vocabulario retail ES |
| https://omniorders.com/blog/inventory-kpis-ecommerce | KPIs con ejemplos |
| https://www.youtube.com/watch?v=t0B0Tgz0b-0 | Sheets avanzado |
| https://coefficient.io/google-sheet-xlookup | Cruces |
| https://www.youtube.com/watch?v=uX0n3i2f7co | Pivots ES |
| https://help.shopify.com/.../inventory-reports | Shopify inventario |
| https://www.youtube.com/watch?v=OVq98oa2ILI | Analytics Shopify |
| [`la-confianza-cv.md`](la-confianza-cv.md) | CV + carta |

### Si sobra tiempo
- GMROI (guía Shopify) · ABC analysis · pivots en Excel si lo prefieres

---

## Dataset mínimo (inventar en ~20 min)

- 12 SKUs, 3 categorías, 2 proveedores  
- Ubicaciones: **Tienda Grecia**, Tienda 2, CEDI (+ Web como canal)  
- 8 semanas ventas + 8 snapshots inventario  
- Inserta: 1 quiebre, 1 exceso, 1 margen raro, 1 SKU sin maestro  

---

## Después del día 12

1. Postular con CV + carta  
2. Revisar Sheet 48 h antes del caso práctico del proceso  
3. Llevar impresa o abierta la pestaña `Recomendaciones` como muestra de criterio (si te lo permiten)

---

## Ritmo si solo tienes 1 h/día

Extiende a **18–20 días**: vocabulario 1–3 · Sheets 4–9 · recomendaciones 10–14 · Shopify/entrevista/CV 15–18.
