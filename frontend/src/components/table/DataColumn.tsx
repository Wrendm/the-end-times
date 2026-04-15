type DataColumnProps = {
  data: unknown;
};

const DataColumn = ({ data }: DataColumnProps) => {
  if (typeof data === "string" || typeof data === "number") return <td>{data}</td>;
  if (typeof data === "boolean") return <td>{data ? "Yes" : "No"}</td>;
  return <td>{JSON.stringify(data)}</td>;
};

export default DataColumn;