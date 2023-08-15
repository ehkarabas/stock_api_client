import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { modalStyle } from "../../styles/globalStyles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useStockCall from "../../hooks/useStockCall";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import { object, string } from "yup";

export default function ProductAddUpdateModal({
  addUpdateModalOpen,
  handleClose,
  info,
  setInfo,
}) {
  const { postStockData, putStockData } = useStockCall();
  const { categories, brands } = useSelector((state) => state.stock);
  const isDark = useSelector((state) => state.theme.isDark);

  const productModalSchema = object({
    category_id: string().required("You must select a category"),
    brand_id: string().required("You must select a brand"),
    name: string()
      .min(3, "Product name must be at least 3 characters")
      .max(30, "Product name must be at most 30 characters")
      .required("You must enter the product name"),
  });

  return (
    <div>
      <Modal
        open={addUpdateModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle(isDark)}>
          <Formik
            initialValues={info}
            validationSchema={productModalSchema}
            onSubmit={(values, actions) => {
              if (info?.id) {
                putStockData(info.id, values);
              } else {
                postStockData(values);
              }
              setInfo({
                category_id: "",
                brand_id: "",
                name: "",
              });
              handleClose();
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
                <FormControl fullWidth>
                  <Field
                    as={TextField}
                    select
                    labelId="category"
                    id="category"
                    name="category_id"
                    label="Category"
                    value={values.category_id || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched?.category_id && Boolean(errors?.category_id)}
                    helperText={touched?.category_id && errors?.category_id}
                  >
                    {categories?.map((category, index) => (
                      <MenuItem value={category.id} key={index}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <FormControl fullWidth>
                  <Field
                    as={TextField}
                    select
                    labelId="brand"
                    id="brand"
                    name="brand_id"
                    label="Brand"
                    value={values.brand_id || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched?.brand_id && Boolean(errors?.brand_id)}
                    helperText={touched?.brand_id && errors?.brand_id}
                  >
                    {brands?.map((brand, index) => (
                      <MenuItem value={brand.id} key={index}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <Field
                  as={TextField}
                  label="Product Name"
                  name="name"
                  id="name"
                  type="text"
                  variant="outlined"
                  value={values.name || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.name && Boolean(errors?.name)}
                  helperText={touched?.name && errors?.name}
                  required
                />
                <Button type="submit" variant="contained">
                  SUBMIT PRODUCT
                </Button>
              </Box>
            )}
          </Formik>
          {/* <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            component="form"
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth>
              <InputLabel id="category">Categories</InputLabel>
              <Select
                labelId="category"
                id="category"
                name="category_id"
                value={info?.category_id}
                label="Category"
                onChange={handleChange}
              >
                {categories?.map((category, index) => (
                  <MenuItem value={category.id} key={index}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="brand">Brands</InputLabel>
              <Select
                labelId="brand"
                id="brand"
                name="brand_id"
                value={info?.brand_id}
                label="Brand"
                onChange={handleChange}
              >
                {brands?.map((brand, index) => (
                  <MenuItem value={brand.id} key={index}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Product Name"
              name="name"
              id="name"
              type="text"
              variant="outlined"
              value={info?.name}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained">
              SUBMIT PRODUCT
            </Button>
          </Box> */}
        </Box>
      </Modal>
    </div>
  );
}
