interface DataStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const DataState = ({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data found.",
  children
}: DataStateProps) => {

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div className="FetchError"><h1>Error: {error}</h1></div>;
  }

  if (isEmpty) {
    return (
      <h1 style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "50px",
        minHeight: "80%"
      }}>
        {emptyMessage}
      </h1>
    );
  }

  return <>{children}</>;
};

export default DataState;