import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo/transparent-logo.svg';

interface HeaderProps {
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Header = ({ onSettingsClick, onMenuClick, showMenuButton = false }: HeaderProps) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ minHeight: { xs: 30, sm: 30 }, py: 0.5 }}>
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          component="img"
          src={logo}
          alt="FirstYears Logo"
          sx={{ height: 32, mr: 2, background: 'white', borderRadius: '30%' }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FirstYears
        </Typography>
        {onSettingsClick && (
          <IconButton color="inherit" aria-label="settings" onClick={onSettingsClick}>
            <SettingsIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
