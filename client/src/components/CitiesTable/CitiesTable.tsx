import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { EnrichedCity } from "../../types";
const { REACT_APP_API_URL, REACT_APP_HIGHLIGHT_THRESHOLD } = process.env;

const CitiesTable = () => {
  const [cities, setCities] = useState<EnrichedCity[]>([]);

  const rows: GridRowsProp = cities.map(
    (city: EnrichedCity, index: number) => ({ id: index, ...city })
  );

  const columns: GridColDef[] = [
    { field: "area", headerName: "Area", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "density", headerName: "Density", width: 150 },
    { field: "population", headerName: "Population", width: 150 },
  ];

  useEffect(() => {
    fetch(`${REACT_APP_API_URL}/cities`)
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <DataGrid
      getRowClassName={(params) => {
        return params.row.population >
          (REACT_APP_HIGHLIGHT_THRESHOLD || 1000000)
          ? "highlight"
          : "";
      }}
      sx={{
        ".highlight": {
          bgcolor: "yellow",
          "&:hover": {
            bgcolor: "salmon",
          },
        },
      }}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 25, page: 0 },
        },
      }}
      rows={rows}
      columns={columns}
    />
  );
};

export default CitiesTable;
