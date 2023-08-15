import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { modalStyle } from "../../styles/globalStyles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useStockCall from "../../hooks/useStockCall";
import { object, string } from "yup";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";

export default function FirmAddUpdateModal({
  addUpdateModalOpen,
  setAddUpdateModalOpen,
  info,
  setInfo,
}) {
  const { postStockData, putStockData } = useStockCall();
  const isDark = useSelector((state) => state.theme.isDark);

  const firmModalSchema = object({
    name: string()
      .min(3, "Name must be at least 3 characters.")
      .max(30, "Name must be at most 30 characters.")
      .required("You must enter firm name."),
    phone: string()
      .matches(
        /(?:(\+|00)\d{1,3})?[ -]?\(?(\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})/g,
        "Must be at xxx-xxx-xxxx format. Whitespace or dash can be used as seperator. Country code in the beginning is optional."
      )
      .required("You must enter firm's phone."),
    address: string()
      .min(35, "Address must be at least 35 characters.")
      .max(120, "Address must be at most 120 characters.")
      .required("You must enter firm's address."),
    image: string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim,
        "URL is not valid"
      )
      .required("You must enter firm's logo url."),
  });

  return (
    <div>
      <Modal
        open={addUpdateModalOpen}
        onClose={() => {
          setAddUpdateModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle(isDark)}>
          <Formik
            initialValues={info}
            validationSchema={firmModalSchema}
            onSubmit={(values, actions) => {
              let newInfo;
              if (info?.id) {
                newInfo = {
                  name: values.name,
                  address: values.address,
                  phone: values.phone,
                  image: values.image,
                };
                putStockData(info.id, newInfo);
              }
              !info?.id && postStockData(values);
              setInfo({
                name: "",
                phone: "",
                address: "",
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
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Firm Name"
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
                  label="Phone"
                  name="phone"
                  id="phone"
                  type="tel"
                  variant="outlined"
                  value={values.phone}
                  error={touched?.phone && Boolean(errors?.phone)}
                  helperText={touched?.phone && errors?.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  id="address"
                  type="text"
                  variant="outlined"
                  value={values.address}
                  error={touched?.address && Boolean(errors?.address)}
                  helperText={touched?.address && errors?.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <TextField
                  label="Image"
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
                <Button type="submit" variant="contained">
                  SUBMIT FIRM
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
