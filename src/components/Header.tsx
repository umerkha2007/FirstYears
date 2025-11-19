import { AppBar, Toolbar, Typography, IconButton, Box, Select, MenuItem, Button, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import logo from '../assets/logo/transparent-logo.svg';
import { useKidProfile } from '../contexts/KidProfileContext';

interface HeaderProps {
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  onManageKidsClick?: () => void;
  onHelpClick?: () => void;
  showMenuButton?: boolean;
  showKidSelector?: boolean;
}

const Header = ({ 
  onSettingsClick, 
  onMenuClick, 
  onManageKidsClick,
  onHelpClick,
  showMenuButton = false,
  showKidSelector = false,
}: HeaderProps) => {
  const { kidProfiles, activeKidProfileId, setActiveKidProfile, hasKidProfiles } = useKidProfile();

  const handleKidChange = (event: any) => {
    setActiveKidProfile(event.target.value);
  };

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          FirstYears
        </Typography>
        
        {/* Kid Profile Selector */}
        {showKidSelector && hasKidProfiles && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Select
              value={activeKidProfileId || ''}
              onChange={handleKidChange}
              size="small"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                },
                minWidth: 120,
              }}
            >
              {kidProfiles.map((kid) => (
                <MenuItem key={kid.id} value={kid.id}>
                  {kid.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {/* Manage Kids Button */}
        {onManageKidsClick && (
          <>
            {/* Desktop version with text */}
            <Button
              color="inherit"
              startIcon={<ChildCareIcon />}
              onClick={onManageKidsClick}
              sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Manage Kids
            </Button>
            {/* Mobile version - icon only */}
            <Tooltip title="Manage Kids">
              <IconButton
                color="inherit"
                aria-label="manage kids"
                onClick={onManageKidsClick}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              >
                <ChildCareIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {/* Help Button */}
        {onHelpClick && (
          <Tooltip title="Show tutorial">
            <IconButton color="inherit" aria-label="help" onClick={onHelpClick}>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        )}

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
