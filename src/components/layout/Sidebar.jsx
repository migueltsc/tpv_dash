// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import useAuth from "../../hooks/useAuth";
import "./Sidebar.css";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const [openAuth, setOpenAuth] = useState(true);

  const handleClickAuth = () => {
    setOpenAuth(!openAuth);
  };

  const menuItems = [
    {
      group: "Auth",
      items: [
        {
          text: "Users",
          value: "users",
          icon: <PeopleIcon />,
        },
        {
          text: "Roles",
          value: "roles",
          icon: <SettingsIcon />,
        },
      ],
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto", p: 2 }}>
        {user && (
          <Box>
            <List>
              <ListItemButton onClick={handleClickAuth}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Auth" />
                {openAuth ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAuth} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menuItems.map((menuGroup) => (
                    <React.Fragment key={menuGroup.group}>
                      {menuGroup.items.map((item) => (
                        <ListItem key={item.text} disablePadding>
                          <Link
                            to={`/${item.value}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                          >
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={onClose}
                            >
                              <ListItemIcon>{item.icon}</ListItemIcon>
                              <ListItemText primary={item.text} />
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;