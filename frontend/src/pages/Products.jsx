import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FirmCard from "../components/FirmCard";
import ProductAddUpdateModal from "../components/modals/ProductAddUpdateModal";
import ProductCard from "../components/ProductCard";
import { getSuccess, fetchFail } from "../features/stockSlice";
import useStockCall from "../hooks/useStockCall";
import { btnStyle, flex } from "../styles/globalStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import ProductDeleteModal from "../components/modals/ProductDeleteModal";

const Products = () => {
  const [deleteID, setDeleteID] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addUpdateModalOpen, setAddUpdateModalOpen] = useState(false);
  const [info, setInfo] = useState({
    category_id: "",
    brand_id: "",
    name: "",
  });

  const { getStockData, deleteStockData, getProdCatgBrnds } = useStockCall();
  const { products } = useSelector((state) => state.stock);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      maxWidth: 70,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 3,
    },
    {
      field: "brand",
      headerName: "Brand",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 2,
    },
    {
      field: "name",
      headerName: "Name",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      flex: 2,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      headerAlign: "center",
      align: "center",
      minWidth: 50,
      editable: true,
      flex: 1,

      renderCell: (props) => (
        <div>
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={() => {
              setInfo({
                id: props.row.id,
                category_id: props.row.category_id,
                brand_id: props.row.brand_id,
                name: props.row.name,
              });
              setAddUpdateModalOpen(true);
            }}
            label="Edit"
            sx={btnStyle}
          />
          <GridActionsCellItem
            icon={<DeleteForeverIcon />}
            onClick={() => {
              setDeleteID(props.row.id);
              setDeleteModalOpen(true);
            }}
            label="Delete"
            sx={btnStyle}
          />
        </div>
      ),
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  useEffect(() => {
    getProdCatgBrnds();
  }, []);

  return (
    <>
      <Helmet>
        <title>Stock - Products</title>
      </Helmet>

      {/* <Typography variant="h4" color="error" mb={3}>
        Products
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setInfo({
            name: "",
            phone: "",
            address: "",
            image: "",
          });
          setOpen(true);
        }}
      >
        NEW PRODUCT
      </Button>

      <ProductModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        info={info}
        setInfo={setInfo}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Brand</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[].map((product, index) => (
              <TableRow
                key={product.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right" component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{product.category}</TableCell>
                <TableCell align="right">{product.brand}</TableCell>
                <TableCell align="right">{product.name}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="right">
                  <DeleteForeverIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* <Grid container sx={flex}>
        {products?.map((product) => (
          <Grid item key={product.id}>
            <ProductCard
              {...product}
              handleOpen={handleOpen}
              setInfo={setInfo}
            />
          </Grid>
        ))}
      </Grid> */}

      <Typography variant="h4" color="error" mb={3}>
        Products
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setInfo({
            category_id: "",
            brand_id: "",
            name: "",
          });
          setAddUpdateModalOpen(true);
        }}
      >
        NEW PRODUCT
      </Button>

      <ProductAddUpdateModal
        addUpdateModalOpen={addUpdateModalOpen}
        handleClose={() => {
          setAddUpdateModalOpen(false);
        }}
        info={info}
        setInfo={setInfo}
      />

      <ProductDeleteModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteID={deleteID}
      />

      <Box sx={{ width: "100%", marginTop: "1rem" }}>
        <DataGrid
          autoHeight
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          sx={{
            boxShadow: 4,
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};

export default Products;
