// src/components/users/UserTable.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  useTheme,
  TableSortLabel,
  Avatar,
  Box,
  Modal,
  Button,
  Typography,
  Toolbar,
} from "@mui/material";
import UserForm from "./UserForm";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import UserSearch from "./UserSearch";
import UserPagination from "./UserPagination";
import UserActions from "./UserActions";
import ImageWithUpload from "../ImageWithUpload";

const RoleLink = ({ roleId, roles }) => {
  const theme = useTheme();
  const role = roles?.find((role) => role.id === roleId);
  const roleName = role ? role.name : "Desconocido";

  return (
    <Link href={`/roles/${roleId}`} underline="none" color="link.main">
      {roleName}
    </Link>
  );
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { user } = useContext(AuthContext);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersResponse = await api.get(
        `/users/?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
      );
      const rolesResponse = await api.get("/roles/");
      setUsers(usersResponse.data);
      setTotalUsers(parseInt(usersResponse.headers["x-total-count"], 10) || 0);
      setRoles(rolesResponse.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (user && user.user.id === id) {
      alert("No puedes eliminar tu propia cuenta.");
      return;
    }

    setUserToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleSort = (property) => {
    const isAsc = sortColumn === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleOpenModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRegisterModalOpen(false);
    setUserToEdit(null);
  };

  const handleSubmit = () => {
    fetchUsers();
    handleCloseModal();
  };

  const handleImageChange = (userId, newImageUrl) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, image_url: newImageUrl } : user
      )
    );
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortColumn || !users) {
      return users || [];
    }

    return [...users].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortColumn, sortOrder]);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error.message}</p>;
  }

  const columns = [
    {
      title: "Imagen",
      key: "image",
      render: (user) => (
        <ImageWithUpload
          imageUrl={user.image_url}
          onChange={(newImageUrl) => handleImageChange(user.id, newImageUrl)}
          entityId={user.id}
          entityRoute="users"
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role_id",
      key: "role_id",
      render: (user) =>
        user ? <RoleLink roleId={user.role_id} roles={roles} /> : "Sin Rol",
    },
    {
      title: "URL de la Imagen",
      dataIndex: "image_url",
      key: "image_url",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (user) => (
        <UserActions
          userId={user.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <UserSearch searchTerm={searchTerm} onSearch={handleSearch} />
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Crear Usuario
        </Button>
      </Toolbar>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "primary.main" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.title === "ID" ||
                column.title === "Nombre" ||
                column.title === "Email" ||
                column.title === "URL de la Imagen" ? (
                  <TableSortLabel
                    active={sortColumn === column.dataIndex}
                    direction={
                      sortColumn === column.dataIndex ? sortOrder : "asc"
                    }
                    onClick={() => handleSort(column.dataIndex)}
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
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(user) : user[column.dataIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalUsers={totalUsers}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="user-form-title"
        aria-describedby="user-form-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="user-form-title" variant="h6" component="h2">
            {userToEdit ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </Typography>
          <UserForm
            initialValues={userToEdit}
            onSubmit={handleSubmit}
            roles={roles}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>
      <DeleteConfirmationModal
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="usuario"
      />
      <Modal
        open={isRegisterModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="register-user-form-title"
        aria-describedby="register-user-form-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="register-user-form-title" variant="h6" component="h2">
            Crear Nuevo Usuario
          </Typography>
          <UserForm
            isRegistering={true}
            onSubmit={handleSubmit}
            roles={roles}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default UserTable;
