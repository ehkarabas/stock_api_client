import React from "react";
import { flexColumn, modalStyle } from "../../styles/globalStyles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import useStockCall from "../../hooks/useStockCall";
import { object, string } from "yup";
import { Formik } from "formik";
import { useSelector } from "react-redux";

export default function BrandAddUpdateModal({
  addUpdateModalOpen,
  setAddUpdateModalOpen,
  info,
  setInfo,
}) {
  const { postStockData, putStockData } = useStockCall();
  const isDark = useSelector((state) => state.theme.isDark);

  const brandModalSchema = object({
    name: string()
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name must be at most 30 characters.")
      .required("You must enter firm name."),
    image: string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim,
        "URL is not valid"
      )
      .required("You must enter firm's logo url."),
  });

  return (
    <Modal
      open={addUpdateModalOpen}
      onClose={() => {
        setAddUpdateModalOpen(false);
        setInfo({ name: "", image: "" });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle(isDark)}>
        <Formik
          initialValues={info}
          validationSchema={brandModalSchema}
          onSubmit={(values, actions) => {
            let newInfo;
            if (info?.id) {
              newInfo = {
                name: values.name,
                image: values.image,
              };
              putStockData(info.id, newInfo);
            }
            !info?.id && postStockData(values);
            setInfo({
              name: "",
              image: "",
            });
            actions.resetForm();
            actions.setSubmitting(false);
            setAddUpdateModalOpen(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Box sx={flexColumn} component={"form"} onSubmit={handleSubmit}>
              <TextField
                label="Brand Name"
                name="name"
                id="name"
                type="text"
                variant="outlined"
                value={values.name}
                error={touched?.name && Boolean(errors?.name)}
                helperText={touched?.name && errors?.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />

              <TextField
                label="Image Url"
                name="image"
                id="image"
                type="url"
                variant="outlined"
                value={values.image}
                error={touched?.image && Boolean(errors?.image)}
                helperText={touched?.image && errors?.image}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <Button type="submit" variant="contained" size="large">
                Save Brand
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
