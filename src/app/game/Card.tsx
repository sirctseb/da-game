export function Card({
  // number,
  children,
}: {
  // number: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 60,
        height: 90,
        border: "1px solid black",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      {children}
    </div>
  );
}
