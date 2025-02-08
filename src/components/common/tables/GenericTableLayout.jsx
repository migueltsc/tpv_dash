// src/components/common/tables/GenericTableLayout.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Toolbar,
  Typography, // Importa Typography
  Box, // Importa Box
} from "@mui/material";
import UserSearch from "../../users/UserSearch"; // Reutilizamos UserSearch de momento, luego podemos generalizarlo
import UserPagination from "../../users/UserPagination"; // Reutilizamos UserPagination de momento, luego podemos generalizarlo
import Button from "../../Button"; // Reutilizamos Button genérico

const GenericTableLayout = ({
  columns,
  data,
  tableTitle, // Nuevo prop para el título de la tabla
  loading,
  error,
  page,
  rowsPerPage,
  totalCount,
  searchTerm,
  sortColumn,
  sortOrder,
  onSearch,
  onChangePage,
  onChangeRowsPerPage,
  onSort,
  onCreateNew, // Prop opcional para la acción "Crear Nuevo"
}) => {
  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error al cargar datos: {error.message}</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Box para alinear título y búsqueda */}
          {tableTitle && ( // Renderiza el título solo si se proporciona
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              {tableTitle}
            </Typography>
          )}
          <UserSearch searchTerm={searchTerm} onSearch={onSearch} />
        </Box>
        {onCreateNew && ( // Renderiza el botón "Crear Nuevo" solo si se proporciona la prop onCreateNew
          <Button variant="contained" color="primary" onClick={onCreateNew}>
            Crear Nuevo
          </Button>
        )}
      </Toolbar>

      <Table sx={{ minWidth: 650 }} aria-label="generic table">
        <TableHead sx={{ backgroundColor: "primary.main" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.sortable ? (
                  <TableSortLabel
                    active={sortColumn === column.dataIndex}
                    direction={
                      sortColumn === column.dataIndex ? sortOrder : "asc"
                    }
                    onClick={() => onSort(column.dataIndex)}
                  >
                    {column.title}
                  </TableSortLabel>
                ) : (
                  column.title
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.map((row) => ( // Verifica si 'data' existe antes de mapear
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row) : row[column.dataIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalUsers={totalCount} // Usamos totalCount en lugar de totalUsers (más genérico)
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default GenericTableLayout;