# Valor Claro · puesta en marcha

Estructura: `public/` (la web), `src/worker.js` (emails + claves PRO), `wrangler.jsonc` (config).

## 1. Publicar en Cloudflare (con GitHub)
1. Crea un repositorio en GitHub y sube TODO el contenido de esta carpeta.
2. Cloudflare > Workers & Pages > Create > Import a repository > elige el repo. Comandos: build vacío; deploy `npx wrangler deploy` (es el que propone por defecto).
3. Settings > Domains & Routes > añade tu dominio comprado.

## 2. Guardar emails (MailerLite)
- MailerLite > Integraciones > API: crea una clave. Crea un grupo y copia su ID.
- Cloudflare > tu Worker > Settings > Variables and Secrets: `MAILERLITE_TOKEN` (secreto), `MAILERLITE_GROUP`.
- Prueba con tu email y comprueba que aparece en el grupo.

## 3. Cobrar (Lemon Squeezy)
- Crea la tienda y un producto «Valor Claro PRO»: suscripción mensual 8,99 €, con claves de licencia activadas.
- Copia el enlace de checkout en `public/assets/calc.js` (`SUB_URL`).
- Variable en Cloudflare `LS_STORE_ID` con el ID de tu tienda (evita aceptar claves de otras tiendas).
- Flujo: el cliente paga, recibe su clave por email, la pega en «Ya tengo clave» de la calculadora. Si cancela y la suscripción caduca, la clave deja de valer.

## 4. Antes de abrir al público
- Cambia `TU-DOMINIO` en `public/sitemap.xml` y `public/robots.txt`.
- Rellena y revisa los textos legales (`public/*.html` legales).
- Compra de prueba y cancelación de prueba tú mismo.
- Limitaciones conocidas: la prueba de 7 días y el límite de 3 empresas se pueden saltar (se guardan en el navegador). Los datos de las empresas no viajan entre dispositivos.
