interface ICurrencyFormatter {
  value: string | number | undefined;
  currencySample?: string;
}
export const currencyFormatter = ({
  value,
  currencySample = "MMK",
}: ICurrencyFormatter) => {
  if (!value) return "-";
  const result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${result} ${currencySample}`;
};
