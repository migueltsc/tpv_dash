// src/components/roles/RolesTable.jsx
import React, { useState, useEffect } from "react";
import GenericTableLayout from "../common/tables/GenericTableLayout";
import api from "../../api/api";
import GenericTableActions from "../common/tables/GenericTableActions";
import GenericForm from "../common/GenericForm";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { Modal, Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalRoles, setTotalRoles] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const { id: roleIdFromRoute } = useParams();
  const navigate = useNavigate();

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/roles/?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}&sort=${sortColumn}&order=${sortOrder}`
      );
      setRoles(response.data);
      setTotalRoles(parseInt(response.headers["x-total-count"], 10) || 0);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage, searchTerm, sortColumn, sortOrder]);

  // **useEffect MODIFICADO: Verifica si !loading antes de buscar el rol**
  useEffect(() => {
    if (roleIdFromRoute && !loading) { // **Añadido !loading aquí**
      const roleToEditFromRoute = roles.find(role => String(role.id) === roleIdFromRoute);
      if (roleToEditFromRoute) {
        setRoleToEdit(roleToEditFromRoute);
        setIsEditModalOpen(true);
      } else {
        // TODO: Manejar caso de rol no encontrado (opcional, por ahora navegamos a /roles)
        console.warn(`Rol con ID ${roleIdFromRoute} no encontrado.`);
        navigate('/roles');
      }
    }
  }, [roleIdFromRoute, roles, loading, navigate]); // **Añadida 'loading' como dependencia**

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = sortColumn === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(property);
  };

  // Handlers para modales y acciones CRUD
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (id) => {
    const role = roles.find((role) => role.id === id);
    setRoleToEdit(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setRoleToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/roles/${roleToDelete}`);
      fetchRoles();
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      // TODO: Manejar errores de forma más robusta
    }
    setDeleteConfirmationOpen(false);
    setRoleToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setRoleToDelete(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setRoleToEdit(null);
    navigate('/roles');
  };

  const handleSubmitRoleForm = () => {
    fetchRoles();
    handleCloseModal();
  };

  const rolesColumns = [
    { title: "ID", dataIndex: "id", key: "id", sortable: true },
    { title: "Nombre", dataIndex: "name", key: "name", sortable: true },
    {
      title: "Acciones",
      key: "actions",
      render: (role) => (
        <GenericTableActions
          entityId={role.id}
          onEdit={() => handleEdit(role.id)}
          onDelete={() => handleDelete(role.id)}
        />
      ),
    },
  ];

  const roleFormConfig = {
    entityType: "rol",
    apiEndpoint: "/roles",
    fields: [
      { name: "name", label: "Nombre del Rol", type: "text", required: true },
    ],
  };

  return (
    <>
      <GenericTableLayout
        columns={rolesColumns}
        data={roles}
        tableTitle="Tabla de Roles"
        loading={loading}
        error={error}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalRoles}
        searchTerm={searchTerm}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSearch={handleSearch}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onSort={handleSort}
        onCreateNew={handleCreateNew}
      />

      {/* Modales para Crear y Editar - Ahora usan GenericForm */}
      <Modal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="create-role-modal-title"
        aria-describedby="create-role-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="create-role-modal-title" variant="h6" component="h2">
            Crear Nuevo Rol
          </Typography>
          <GenericForm
            formConfig={roleFormConfig}
            onSubmit={handleSubmitRoleForm}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-role-modal-title"
        aria-describedby="edit-role-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="edit-role-modal-title" variant="h6" component="h2">
            Editar Rol
          </Typography>
          <GenericForm
            formConfig={roleFormConfig}
            initialValues={roleToEdit}
            onSubmit={handleSubmitRoleForm}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>

      <DeleteConfirmationModal
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="rol"
      />
    </>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default RolesTable;