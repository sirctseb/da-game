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
        boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
        fontSize: 24,
        fontWeight: "bold",
        position: "relative",
      }}
    >
      {/* {number} */}
      {/* {children && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            fontSize: 12,
            fontWeight: "normal",
          }}
        >
          {children}
        </div>
      )} */}
      {children}
    </div>
  );
}
