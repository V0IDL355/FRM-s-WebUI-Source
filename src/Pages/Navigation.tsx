import { Menu } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Drawer from '@mui/material/Drawer/Drawer';
import IconButton from '@mui/material/IconButton/IconButton';
import Paper from '@mui/material/Paper/Paper';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { signal } from '@preact/signals-react';
import pages from '../Utils/pages';

const drawer = signal(false);

function Navigation() {
  const theme = useTheme();
  const isSmallScreenX = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreenY = useMediaQuery(theme.breakpoints.down("sm"));

  return !isSmallScreenX && !isSmallScreenY ? (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10, // Adjust the zIndex as needed
      }}
    >
      <Paper elevation={1}>
        <ButtonGroup
          sx={{
            position: "relative",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
          }}
          variant="outlined"
          fullWidth={true}
        >
          {pages.map((page) => (
            <Button key={page.label} href={`/#/${page.link}`} fullWidth={true}>
              {page.icon}
              {page.label}
            </Button>
          ))}
        </ButtonGroup>
      </Paper>
    </Box>
  ) : (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <Paper elevation={2} square>
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          sx={{
            width: "100%",
          }}
          onClick={() => {
            drawer.value = !drawer.value;
          }}
        >
          <Menu />
        </IconButton>
      </Paper>

      <Drawer
        anchor="bottom"
        open={drawer.value}
        onClose={() => {
          drawer.value = false;
        }}
      >
        <ButtonGroup
          sx={{
            zIndex: 10,
          }}
          color="primary"
          fullWidth={true}
          orientation="vertical"
        >
          {pages.map((page) => (
            <Button key={page.label} href={`/#/${page.link}`} fullWidth={true}>
              {page.icon}
              {page.label}
            </Button>
          ))}
        </ButtonGroup>
      </Drawer>
    </Box>
  );
}

export default Navigation;
