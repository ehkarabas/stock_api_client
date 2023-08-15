import { Grid } from "@mui/material";
import { Card, Title, LineChart } from "@tremor/react";
import { useSelector } from "react-redux";

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

const Charts = () => {
  const { sales, purchases } = useSelector((state) => state.stock);

  const salesData = sales.map((item) => ({
    date: item.createds,
    Sale: Number(item.price_total),
  }));

  const purchaseData = purchases.map((item) => ({
    date: item.createds,
    Purchase: Number(item.price_total),
  }));

  return (
    <Grid container justifyContent={"center"} spacing={3} mt={3}>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <Title>Total Sales</Title>
          <LineChart
            data={salesData}
            index="date"
            categories={["Sale"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <Title>Total Purchases</Title>
          <LineChart
            data={purchaseData}
            index="date"
            categories={["Purchase"]}
            colors={["red"]}
            valueFormatter={dataFormatter}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Charts;
