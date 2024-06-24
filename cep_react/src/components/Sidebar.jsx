import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, Typography, Box, Divider, Avatar } from '@mui/material';
import { ListAlt, Build, Code, Person, Equalizer, PlaylistAddCheck, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; 

const Sidebar = ({ isLoggedIn, username }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      className="drawer"
      classes={{ paper: 'drawerPaper' }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isLoggedIn && (
          <>
            <Avatar className="avatar">{username.charAt(0)}</Avatar>
            <Typography variant="h6" className="usernameTitle">{username} 님</Typography>
            <Typography variant="body2" color="white">환영합니다!</Typography>
          </>
        )}
      </Box>
      <Divider />
      <List>
        {isLoggedIn && (
          <>
            <ListItemButton component={Link} to="/monitor">
              <ListItemIcon className="listItemIcon">
                <Equalizer />
              </ListItemIcon>
              <ListItemText primary="모니터링" />
            </ListItemButton>

            <ListItemButton component={Link} to="/equipments">
              <ListItemIcon className="listItemIcon">
                <Build />
              </ListItemIcon>
              <ListItemText primary="설비/아이템 관리" />
            </ListItemButton>

            <ListItemButton component={Link} to="/rules" onClick={handleClick}>
              <ListItemIcon className="listItemIcon">
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="룰 관리" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <>
            {open && (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/rules/list">
                  <ListItemIcon className="listItemIcon">
                    <PlaylistAddCheck />
                  </ListItemIcon>
                  <ListItemText primary="룰 리스트" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/rules/results">
                  <ListItemIcon className="listItemIcon">
                    <PlaylistAddCheck />
                  </ListItemIcon>
                  <ListItemText primary="룰 처리 결과 조회" />
                </ListItemButton>
              </List>
            )}
            </>
            
            <ListItemButton component={Link} to="/codes">
              <ListItemIcon className="listItemIcon">
                <Code />
              </ListItemIcon>
              <ListItemText primary="공통 코드 관리" />
            </ListItemButton>

            <ListItemButton component={Link} to="/users">
              <ListItemIcon className="listItemIcon">
                <Person />
              </ListItemIcon>
              <ListItemText primary="사용자 정보 관리" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
