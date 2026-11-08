// Utility for formatting integer Rupiah amounts consistently across the app.
// Stored values are always pure integers (e.g. 15000), formatted only for UI display.

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
