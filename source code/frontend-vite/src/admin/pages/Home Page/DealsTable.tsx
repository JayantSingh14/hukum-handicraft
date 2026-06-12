import { Box, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import EditIcon from '@mui/icons-material/Edit';
import { deleteDeal, getAllDeals } from '../../../Redux Toolkit/Admin/DealSlice';
import UpdateDealForm from './UpdateDealForm';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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

const DealsTable = () => {
  const { deal } = useAppSelector(store => store)
  const [selectedDealId, setSelectedDealId] = useState<number>();
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch()

  const handleOpen = (id: number | undefined) => () => {
    setSelectedDealId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleDelete = (id: any) => () => {
    dispatch(deleteDeal(id))
  }

  useEffect(() => {
    dispatch(getAllDeals())
  }, [dispatch])

  return (
    <>
      <div className="border border-brand-gold/15 bg-white overflow-hidden">
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0F0F0F" }}>
                {["No", "Image", "Category", "Discount", "Edit", "Delete"].map((h) => (
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
              {deal.deals.map((deal: any, index) => (
                <TableRow
                  key={deal.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FAF8F2" : "#FFFFFF",
                    "&:hover": { backgroundColor: "rgba(200,162,74,0.04)" },
                  }}
                >
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#0F0F0F" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <img
                      className="w-16 h-20 object-cover border border-brand-gold/10"
                      src={deal.category.image}
                      alt=""
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0F0F0F" }}>
                    {deal.category.categoryId}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#C8A24A" }}>
                    {deal.discount}% OFF
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={handleOpen(deal.id)}
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
                  <TableCell>
                    <IconButton
                      onClick={handleDelete(deal.id)}
                      size="small"
                      sx={{
                        color: "#C0392B",
                        border: "1px solid rgba(192, 57, 43, 0.25)",
                        borderRadius: 0,
                        p: 0.8,
                        "&:hover": { bgcolor: "rgba(192, 57, 43, 0.08)" }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {deal.deals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                    No deals found. Create a deal to run a campaign.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {selectedDealId && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <UpdateDealForm id={selectedDealId} />
          </Box>
        </Modal>
      )}
    </>
  )
}

export default DealsTable;