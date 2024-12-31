import { format } from "date-fns";

export const DisplayValue = ({ value }: { value: unknown }) => {
  console.log(value);
  if (typeof value === "object") {
    return Object.entries(value as object).map(([addrKey, addrValue]) => (
      <p key={addrKey}>{String(addrValue)}</p>
    ));
  } else if (Array.isArray(value)) {
    return value.map((item, i) => <p key={i}>{String(item)}</p>);
  } else if (typeof value === "number") {
    console.log(value);
    // TODO: Low: May not work for all numbers
    // TODO: Low format the number
    return <p>${String(value)}</p>;
  } else if (value instanceof Date) {
    // TODO: Low: The date display doesn't work for created at
    return <p>{format(value, "MM/dd/yyyy")}</p>;
  }
  return <p>{String(value)}</p>;
};
