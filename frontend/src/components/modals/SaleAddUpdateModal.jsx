import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { modalStyle } from "../../styles/globalStyles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import useStockCall from "../../hooks/useStockCall";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import { object, number } from "yup";

const saleModalSchema = object().shape({
  brand_id: number().required("You must select a brand"),
  product_id: number().required("You must select a product"),
  quantity: number()
    .min(0, "Quantity must be a positive number")
    .required("Quantity is required"),
  price: number()
    .min(0, "Price must be a positive number")
    .required("Price is required"),
});

export default function SaleAddUpdateModal({
  open,
  handleClose,
  info,
  setInfo,
}) {
  const navigate = useNavigate();
  const { postStockData, putStockData } = useStockCall();
  const { products, brands } = useSelector((state) => state.stock);
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          setInfo({});
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle(isDark)}>
          <Formik
            initialValues={info}
            validationSchema={saleModalSchema}
            onSubmit={(values, actions) => {
              if (info.id) {
                putStockData(info.id, values);
              } else {
                postStockData(values);
              }
              handleClose();
              setInfo({});
              actions.setSubmitting(false);
            }}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              values,
            }) => (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                component="form"
                onSubmit={handleSubmit}
              >
                <Field
                  as={TextField}
                  select
                  label="Brand"
                  name="brand_id"
                  value={values.brand_id || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.brand_id && Boolean(errors?.brand_id)}
                  helperText={touched?.brand_id && errors?.brand_id}
                  required
                >
                  {brands?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  select
                  label="Product"
                  name="product_id"
                  value={values.product_id || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.product_id && Boolean(errors?.product_id)}
                  helperText={touched?.product_id && errors?.product_id}
                  required
                >
                  {products?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={values.quantity || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.quantity && Boolean(errors?.quantity)}
                  helperText={touched?.quantity && errors?.quantity}
                  inputProps={{ min: 0 }}
                  required
                />
                <Field
                  as={TextField}
                  type="number"
                  label="Price"
                  name="price"
                  value={values.price || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.price && Boolean(errors?.price)}
                  helperText={touched?.price && errors?.price}
                  inputProps={{ min: 0 }}
                  required
                />
                <Button type="submit" variant="contained">
                  {info?.id ? "Update Sale" : "Add New Sale"}
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
