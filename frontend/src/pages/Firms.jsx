import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FirmCard from "../components/FirmCard";
import FirmAddUpdateModal from "../components/modals/FirmAddUpdateModal";
import FirmDeleteModal from "../components/modals/FirmDeleteModal";
import { getSuccess, fetchFail } from "../features/stockSlice";
import useStockCall from "../hooks/useStockCall";
import { flex } from "../styles/globalStyles";
import { Helmet } from "react-helmet";

const Firms = () => {
  const [deleteID, setDeleteID] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addUpdateModalOpen, setAddUpdateModalOpen] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

  const { getStockData } = useStockCall();
  const { firms } = useSelector((state) => state.stock);

  useEffect(() => {
    getStockData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Stock - Firms</title>
      </Helmet>
      <Typography variant="h4" color="error" mb={3}>
        Firm
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
          setAddUpdateModalOpen(true);
        }}
      >
        NEW FIRM
      </Button>

      <FirmAddUpdateModal
        addUpdateModalOpen={addUpdateModalOpen}
        setAddUpdateModalOpen={setAddUpdateModalOpen}
        info={info}
        setInfo={setInfo}
      />

      <FirmDeleteModal
        deleteID={deleteID}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <Grid container sx={flex}>
        {firms?.map((firm) => (
          <Grid
            item
            key={firm.id}
            sx={{
              marginTop: "1rem",
            }}
          >
            <FirmCard
              {...firm}
              setAddUpdateModalOpen={setAddUpdateModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteID={setDeleteID}
              setInfo={setInfo}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Firms;
