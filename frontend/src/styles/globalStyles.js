export const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
};

export const btnStyle = {
  cursor: "pointer",
  "&:hover": { color: "red" },
};

export const modalStyle = (isDark = false) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: isDark ? "#64748B" : "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
});

export const deleteModalStyle = {
  position: "absolute",
  top: "50vh",
  left: "50vw",
  transform: "translate(-50%, -50%)",
  minWidth: "270px",
  width: "50%",
  maxWidth: "768px",
  p: 2,
};

export const flexCenter = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
};

export const flexColumn = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
