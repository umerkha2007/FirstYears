import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SettingsIcon from '@mui/icons-material/Settings';

const Header = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <ChildCareIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FirstYears
        </Typography>
        <IconButton color="inherit" aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
