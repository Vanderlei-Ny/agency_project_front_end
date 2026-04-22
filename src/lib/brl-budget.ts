const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Interpreta valor salvo no backend como centavos.
 * Legado: só dígitos = valor inteiro em reais (ex.: "10000" → R$ 10.000,00).
 * Novo: string decimal "15000.50".
 */
export function budgetStoredToCents(stored: string | undefined | null): number {
  if (stored == null || !String(stored).trim()) return 0;
  const t = String(stored).trim().replace(/\s/g, "");
  if (/^\d+$/.test(t)) {
    return parseInt(t, 10) * 100;
  }
  const normalized = t.includes(",")
    ? t.replace(/\./g, "").replace(",", ".")
    : t;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function centsToApiString(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoneyFromCents(cents: number): string {
  return money.format(cents / 100);
}

export function formatBudgetStoredForDisplay(
  stored: string | undefined | null,
): string {
  if (stored == null || !String(stored).trim()) return "—";
  const cents = budgetStoredToCents(stored);
  return money.format(cents / 100);
}
