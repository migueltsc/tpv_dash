// src/components/users/UserPagination.jsx
import React from "react";
import { TablePagination } from "@mui/material";

const UserPagination = ({
  page,
  rowsPerPage,
  totalUsers,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[10, 50, 1000]}
      component="div"
      count={totalUsers}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      labelRowsPerPage="Filas por página:"
    />
  );
};

export default UserPagination;
