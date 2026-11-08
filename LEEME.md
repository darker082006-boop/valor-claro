# Valor Claro · guía de publicación

## Estructura
- `/` landing con calculadora interactiva · `/calculadora/` calculadora gratis + PRO (la prueba de 7 días se activa aquí) · `/pro/` precio y demo
- `/guias/` con 6 guías · `/sobre-mi/` (foto en `assets/dario.jpg`) · `/gracias/`
- `aviso-legal.html`, `privacidad.html`, `cookies.html`, `condiciones.html`: BORRADORES con huecos entre corchetes.
- `assets/calc.js` (lógica) y `assets/style.css` (estilo).

## Publicar gratis
Cloudflare Pages o Netlify: proyecto con subida manual y arrastra esta carpeta. Para editar: pides el cambio, descargas la carpeta nueva y la vuelves a subir.

## Guardar emails en MailerLite
1. MailerLite > Integraciones > API: crea una clave. Crea un grupo (p. ej. «Valor Claro») y copia su ID.
2. Cloudflare Pages > tu proyecto > Settings > Variables and Secrets: añade `MAILERLITE_TOKEN` (secreto) y `MAILERLITE_GROUP`.
3. En `assets/calc.js` pon `FORM_URL:"/api/subscribe"` y vuelve a desplegar. La función está en `functions/api/subscribe.js`.
4. Prueba con un email tuyo y mira que aparece en el grupo. Si tu subida no incluye Functions, despliega con Git o con Wrangler.

## Qué conectar (primeras líneas de `assets/calc.js`)
- `SUB_URL`: enlace de pago de la suscripción.
- `FORM_URL`: `/api/subscribe` (ver arriba).
- `PROMO`: texto de una franja de oferta bajo el menú de la calculadora (vacío = sin franja).
- `sitemap.xml` y `robots.txt`: cambia `TU-DOMINIO`.

## Antes de cobrar
- La prueba de 7 días y el límite de 3 empresas funcionan en el navegador: se pueden saltar. Para cobrar de verdad hacen falta cuentas y comprobación en servidor.
- Revisa los cuatro textos legales con un profesional.
