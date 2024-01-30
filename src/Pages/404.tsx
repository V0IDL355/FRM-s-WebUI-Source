import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import pages from "../Utils/pages";

function NotFoundPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Container>
        <Typography variant="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" href={pages[0].link}>
          Go back to home
        </Button>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
