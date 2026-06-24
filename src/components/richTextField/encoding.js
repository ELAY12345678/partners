/**
 * Convierte caracteres Unicode a entidades HTML numéricas (&#128515;).
 * Evita que emojis se corrompan como "?" en bases de datos sin utf8mb4.
 * Idempotente: no altera contenido que ya usa solo ASCII (incl. entidades existentes).
 */
export function encodeUnicodeForStorage(html) {
    if (!html || typeof html !== 'string') return html;

    return html.replace(
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0080-\uFFFF]/g,
        (char) => `&#${char.codePointAt(0)};`,
    );
}
