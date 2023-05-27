import Box from '@mui/material/Box/Box';
import coupon from '/img/ResourceSink/coupon.png';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import Card from '@mui/material/Card/Card';
import { LinearProgress } from '@mui/material';

function ResourceSink() {
  const [resData, setData] = React.useState([] as any[]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('http://localhost:8080/getResourceSink')
          .then((res) => res.json())
          .then((data) => {
            setData(data);
          });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function Progress() {
    return (
      <React.Fragment>
        <LinearProgress
          sx={{
            backgroundColor: 'primary',
          }}
          variant="determinate"
          value={resData[0] ? resData[0].Percent : 0}
        />
      </React.Fragment>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
      }}
    >
      <Card
        sx={{
          backgroundImage: `url(${coupon})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
          backgroundPositionY: 'center',
          top: '50%',
          left: '50%',
          transform: 'translate(50%, 50%)',
          width: '50%',
          height: '50%',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Card
          sx={{
            position: 'absolute',
            top: '25vh',
            left: '6.5vw',
            width: '37vw',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            backgroundImage: 'none',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '5vw',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            {resData[0] ? resData[0].NumCoupon : 0}
          </Typography>
          {Progress()}
        </Card>
      </Card>
    </Box>
  );
}

export default ResourceSink;
