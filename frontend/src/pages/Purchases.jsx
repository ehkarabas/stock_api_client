import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import useStockCall from "../hooks/useStockCall";

import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { btnStyle } from "../styles/globalStyles";
import EditIcon from "@mui/icons-material/Edit";
import PurchaseAddUpdateModal from "../components/modals/PurchaseAddUpdateModal";
import { Helmet } from "react-helmet";
import PurchaseDeleteModal from "../components/modals/PurchaseDeleteModal";

const Purchases = () => {
  const { getStockData, getFirmData, getProdCatgBrnds } = useStockCall();
  const [deleteID, setDeleteID] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { purchases } = useSelector((state) => state.stock);
  const [open, setOpen] = useState(false);

  const [info, setInfo] = useState({
    firm_id: "",
    brand_id: "",
    product_id: "",
    quantity: "",
    price: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const purchasesFetcher = async () => {
      await Promise.all([
        getStockData("purchases"),
        getFirmData(),
        getProdCatgBrnds("purchases"),
      ]);
    };
    purchasesFetcher();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} - ${hour}:${minute}`;
  };

  const columns = [
    {
      field: "created_date",
      headerName: "Date",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "firm",
      headerName: "Firm",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price_total",
      headerName: "Amount",
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 40,
      headerAlign: "center",
      align: "center",
      renderCell: ({
        id,
        row: { brand_id, product_id, quantity, price, firm_id },
      }) => {
        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              setOpen(true);
              setInfo({ id, firm_id, brand_id, product_id, quantity, price });
            }}
            sx={btnStyle}
          />,
          <GridActionsCellItem
            key={"delete"}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              setDeleteID(id);
              setDeleteModalOpen(true);
            }}
            sx={btnStyle}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Stock - Purchases</title>
      </Helmet>

      <Typography variant="h4" color="error" mb={3}>
        Purchases
      </Typography>

      <Button variant="contained" onClick={handleOpen}>
        New Purchase
      </Button>

      <PurchaseAddUpdateModal
        open={open}
        handleClose={handleClose}
        info={info}
        setInfo={setInfo}
      />

      <PurchaseDeleteModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteID={deleteID}
      />

      <Box
        sx={{
          width: "100%",
          marginTop: "1rem",
        }}
      >
        <DataGrid
          autoHeight
          rows={purchases || []}
          columns={columns}
          pageSize={10}
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            boxShadow: 4,
          }}
        />
      </Box>
    </>
  );
};

export default Purchases;
