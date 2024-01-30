import { Card, CardContent, Typography } from "@mui/material";

function tooltip(o) {
  const { payload } = o;
  if (!payload) {
    return null;
  }
  return (
    <Card>
      <CardContent>
        {payload.map((entry: object, index: number) => (
          <Typography key={`item-${index}`} sx={{ color: entry["color"] }}>
            {entry["name"]}: {entry["value"]}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}

export default tooltip;
