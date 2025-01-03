export const DisplayValue = ({ value }: { value: unknown }) => {
  if (typeof value === "object") {
    return Object.entries(value as object).map(([addrKey, addrValue]) => (
      <p key={addrKey}>{String(addrValue)}</p>
    ));
  } else if (Array.isArray(value)) {
    return value.map((item, i) => <p key={i}>{String(item)}</p>);
  } else if (typeof value === "number") {
    // TODO: Low: May not work for all numbers
    return <p>${value.toLocaleString()}</p>;
  } else if (value instanceof Date) {
    return <p>{value.toISOString()}</p>;
  }
  return <p>{String(value)}</p>;
};
