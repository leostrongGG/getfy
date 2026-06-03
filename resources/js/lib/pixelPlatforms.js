/**
 * Helpers para saber quais plataformas de pixel estão ativas no checkout.
 */

function platformEntries(pixels, key) {
    const block = pixels?.[key];
    if (!block?.enabled) {
        return [];
    }
    if (Array.isArray(block.entries) && block.entries.length) {
        return block.entries;
    }
    return [];
}

export function pixelsNeedMeta(pixels) {
    return platformEntries(pixels, 'meta').length > 0;
}

export function pixelsNeedGoogle(pixels) {
    return (
        platformEntries(pixels, 'google_ads').length > 0
        || platformEntries(pixels, 'google_analytics').length > 0
    );
}

export function pixelsNeedTiktok(pixels) {
    return platformEntries(pixels, 'tiktok').length > 0;
}

export function allPixelEntries(pixels) {
    return [
        ...platformEntries(pixels, 'meta'),
        ...platformEntries(pixels, 'tiktok'),
        ...platformEntries(pixels, 'google_ads'),
        ...platformEntries(pixels, 'google_analytics'),
    ];
}

/** true se algum pixel dispara Purchase ao gerar PIX (padrão: true). */
export function shouldFirePurchaseOnPixGeneration(pixels) {
    return allPixelEntries(pixels).some((entry) => entry?.fire_purchase_on_pix !== false);
}

/** true se algum pixel dispara Purchase ao gerar boleto (padrão: true). */
export function shouldFirePurchaseOnBoletoGeneration(pixels) {
    return allPixelEntries(pixels).some((entry) => entry?.fire_purchase_on_boleto !== false);
}

export function isValidGtmContainerId(id) {
    if (typeof id !== 'string') {
        return false;
    }
    const trimmed = id.trim().toUpperCase();
    return /^GTM-[A-Z0-9]+$/.test(trimmed);
}

export function getGtmContainerId(pixels) {
    const block = pixels?.gtm;
    if (!block?.enabled) {
        return '';
    }
    const id = String(block.container_id ?? '').trim().toUpperCase();
    return isValidGtmContainerId(id) ? id : '';
}
