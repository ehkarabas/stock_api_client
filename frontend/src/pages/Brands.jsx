import { Alert, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BrandCard from "../components/BrandCard";
import BrandAddUpdateModal from "../components/modals/BrandAddUpdateModal";
import BrandDeleteModal from "../components/modals/BrandDeleteModal";
import useStockCall from "../hooks/useStockCall";
import { flex } from "../styles/globalStyles";
import { Helmet } from "react-helmet";

const Brands = () => {
  const { getStockData } = useStockCall();
  const { brands, loading } = useSelector((state) => state.stock);
  const [deleteID, setDeleteID] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addUpdateModalOpen, setAddUpdateModalOpen] = useState(false);
  const [info, setInfo] = useState({ name: "", image: "" });

  useEffect(() => {
    getStockData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Stock - Brands</title>
      </Helmet>

      <Typography variant="h4" color="error" mb={3}>
        Brand
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setInfo({ name: "", image: "" });
          setAddUpdateModalOpen(true);
        }}
      >
        NEW BRAND
      </Button>

      <BrandAddUpdateModal
        addUpdateModalOpen={addUpdateModalOpen}
        setAddUpdateModalOpen={setAddUpdateModalOpen}
        info={info}
        setInfo={setInfo}
      />

      <BrandDeleteModal
        deleteID={deleteID}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      {!loading && !brands?.length && (
        <Alert severity="warning" sx={{ mt: 4, width: "50%" }}>
          There is no brand to show
        </Alert>
      )}

      {brands?.length > 0 && (
        <Grid container sx={flex} mt={2}>
          {brands?.map((brand) => (
            <Grid item key={brand.id}>
              <BrandCard
                {...brand}
                setAddUpdateModalOpen={setAddUpdateModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                setDeleteID={setDeleteID}
                setInfo={setInfo}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Brands;
