<?php

namespace App\Support;

/**
 * Normalização SHA-256 de PII para webhooks de integração (LGPD + plataformas como Meta).
 *
 * Algoritmo alinhado ao Conversions API (e-mail minúsculo, telefone só dígitos com DDI 55, documento só dígitos).
 * Não envie estes valores em texto claro para URLs de terceiros.
 */
class WebhookPiiHasher
{
    public static function includesPlainCustomerPii(): bool
    {
        return (bool) config('getfy.webhooks.include_plain_customer_pii', false);
    }

    /**
     * @return array<string, string>
     */
    public static function customerIdentifiers(
        ?string $email,
        ?string $phone,
        ?string $document,
        ?string $name,
    ): array {
        $out = [];

        $emailHash = self::hashEmail($email);
        if ($emailHash !== null) {
            $out['email_hash'] = $emailHash;
        }

        $phoneHash = self::hashPhone($phone);
        if ($phoneHash !== null) {
            $out['phone_hash'] = $phoneHash;
        }

        $docHash = self::hashDocument($document);
        if ($docHash !== null) {
            $out['cpf_hash'] = $docHash;
        }

        $nameHash = self::hashName($name);
        if ($nameHash !== null) {
            $out['name_hash'] = $nameHash;
        }

        if (self::includesPlainCustomerPii()) {
            if (is_string($email) && trim($email) !== '') {
                $out['email'] = trim($email);
            }
            if (is_string($phone) && trim($phone) !== '') {
                $out['phone'] = trim($phone);
            }
            if (is_string($document) && trim($document) !== '') {
                $out['cpf'] = trim($document);
            }
            if (is_string($name) && trim($name) !== '') {
                $out['name'] = trim($name);
            }
        }

        return $out;
    }

    public static function hashEmail(?string $email): ?string
    {
        if ($email === null || trim($email) === '') {
            return null;
        }

        return hash('sha256', strtolower(trim($email)));
    }

    public static function hashPhone(?string $phone): ?string
    {
        if ($phone === null || trim($phone) === '') {
            return null;
        }
        $digits = preg_replace('/\D/', '', $phone);
        if ($digits === '' || strlen($digits) < 10) {
            return null;
        }
        if (! str_starts_with($digits, '55')) {
            $digits = '55'.$digits;
        }

        return hash('sha256', $digits);
    }

    public static function hashDocument(?string $document): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $document);
        if ($digits === '' || strlen($digits) < 11) {
            return null;
        }

        return hash('sha256', $digits);
    }

    public static function hashName(?string $name): ?string
    {
        if ($name === null || trim($name) === '') {
            return null;
        }

        $normalized = mb_strtolower(preg_replace('/\s+/', ' ', trim($name)) ?? trim($name));

        return hash('sha256', $normalized);
    }
}
