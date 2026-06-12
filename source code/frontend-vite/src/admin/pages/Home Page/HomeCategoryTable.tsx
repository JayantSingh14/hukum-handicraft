import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, IconButton, Modal } from "@mui/material";
import type { HomeCategory } from "../../../types/homeDataTypes";
import EditIcon from "@mui/icons-material/Edit";
import UpdateHomeCategoryForm from "./UpdateHomeCategoryForm";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFFFFF",
  border: "1px solid rgba(200, 162, 74, 0.3)",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

function HomeCategoryTable({ categories }: { categories: HomeCategory[] | undefined }) {
  const [selectedCategory, setSelectedCategory] = React.useState<HomeCategory>();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (category: HomeCategory | undefined) => () => {
    setSelectedCategory(category);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="border border-brand-gold/15 bg-white overflow-hidden">
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0F0F0F" }}>
                {["No", "ID", "Image", "Category ID", "Edit"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#C8A24A",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(200,162,74,0.2)",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category: HomeCategory, index) => (
                <TableRow
                  key={category.categoryId}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                    "&:hover": { backgroundColor: "rgba(200,162,74,0.04)" },
                  }}
                >
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#0F0F0F" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#4A4A4A" }}>
                    {category.id}
                  </TableCell>
                  <TableCell>
                    <img
                      className="w-16 h-20 object-cover border border-brand-gold/10"
                      src={category.image}
                      alt=""
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0F0F0F" }}>
                    {category.categoryId}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={handleOpen(category)}
                      size="small"
                      sx={{
                        color: "#C8A24A",
                        border: "1px solid rgba(200,162,74,0.3)",
                        borderRadius: 0,
                        p: 0.8,
                        "&:hover": { bgcolor: "rgba(200,162,74,0.1)" }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(categories || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                    No categories configured.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateHomeCategoryForm
            category={selectedCategory}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </>
  );
}

export default HomeCategoryTable;