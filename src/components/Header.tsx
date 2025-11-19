import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

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
        <ChildCareIcon sx={{ mr: 2 }} />
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
