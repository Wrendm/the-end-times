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
    return 
    <div>
      <div className="loader"></div>
      <p>Don't worry, it'll load, it just takes a second because I'm on the free tier :P</p>
      <p>Tell enough of your friends and maybe I'll start paying for it</p>
    </div>;
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