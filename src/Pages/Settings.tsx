import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField/TextField";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Typography from "@mui/material/Typography";
import {signal} from "@preact/signals-react";
import {MuiColorInput} from "mui-color-input";
import {primaryColor, resetDefault, secondaryColor,} from "../Utils/setting vars";
import {connected} from "../Utils/utils";
import {ChangeEvent} from "react";

const alert = signal({error: false, message: ""});

function Settings() {
    return (
        <Box>
            <Container>
                <Box>
                    <Snackbar
                        open={alert.value.message != ""}
                        autoHideDuration={6000}
                        onClose={() => {
                            alert.value = {error: false, message: ""};
                        }}
                    >
                        <Alert
                            variant="filled"
                            severity={alert.value.error ? "error" : "success"}
                            sx={{
                                width: "50%",
                                position: "fixed",
                                bottom: "10%",
                                left: "25%",
                            }}
                        >
                            {alert.value.message}
                        </Alert>
                    </Snackbar>
                    <Typography sx={{textAlign: "center", fontSize: "2ex"}}>
                        Web UI Version : {import.meta.env.PACKAGE_VERSION}
                    </Typography>
                    <List
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Card elevation={0} sx={{margin: 5}}>
                            <Card variant="outlined" sx={{padding: 2}}>
                                <Typography sx={{textAlign: "center"}}>Global</Typography>
                                <TextField
                                    fullWidth={true}
                                    label="API url"
                                    defaultValue={localStorage.getItem("url")}
                                    variant="outlined"
                                    onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                                        const connectStatus = await connected(event.target.value);
                                        alert.value = connectStatus
                                            ? {error: false, message: "Valid URL!"}
                                            : {error: true, message: "Invalid URL!"};
                                    }}
                                ></TextField>
                                <TextField
                                    sx={{marginTop: "10px"}}
                                    fullWidth={true}
                                    label="Fetch Speed"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">ms</InputAdornment>
                                        ),
                                    }}
                                    defaultValue={localStorage.getItem("fspeed")}
                                    variant="outlined"
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        if (parseInt(event.target.value)) {
                                            localStorage.setItem("fspeed", event.target.value);
                                            alert.value = {error: false, message: "Valid speed!"};
                                        } else {
                                            alert.value = {error: true, message: "Invalid speed!"};
                                        }
                                    }}
                                ></TextField>
                                <TextField
                                    sx={{marginTop: "10px"}}
                                    fullWidth={true}
                                    label="Map Fetch Speed"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">ms</InputAdornment>
                                        ),
                                    }}
                                    defaultValue={localStorage.getItem("mfspeed")}
                                    variant="outlined"
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        if (parseInt(event.target.value)) {
                                            localStorage.setItem("mfspeed", event.target.value);
                                            alert.value = {error: false, message: "Valid speed!"};
                                        } else {
                                            alert.value = {error: true, message: "Invalid speed!"};
                                        }
                                    }}
                                ></TextField>
                            </Card>
                            <Box sx={{margin: "10px"}}></Box>
                            <Card variant="outlined" sx={{padding: 2}}>
                                <Typography sx={{textAlign: "center", fontStyle: "bold"}}>
                                    Theme
                                </Typography>
                                <Tooltip title="Primary Color">
                                    <MuiColorInput
                                        fullWidth={true}
                                        value={primaryColor.value}
                                        onChange={(val) => {
                                            localStorage.setItem("primaryC", val);
                                            primaryColor.value = val;
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip sx={{marginTop: "10px"}} title="Secondary Color">
                                    <MuiColorInput
                                        fullWidth={true}
                                        value={secondaryColor.value}
                                        onChange={(val) => {
                                            localStorage.setItem("secondaryC", val);
                                            secondaryColor.value = val;
                                        }}
                                    />
                                </Tooltip>
                                <Button
                                    sx={{marginTop: "10px"}}
                                    variant="outlined"
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                    fullWidth
                                >
                                    Refresh To Apply
                                </Button>
                                <Button
                                    sx={{marginTop: "10px"}}
                                    variant="outlined"
                                    onClick={resetDefault}
                                    fullWidth
                                >
                                    Reset To Default
                                </Button>
                            </Card>
                        </Card>
                    </List>
                </Box>
            </Container>
        </Box>
    );
}

export default Settings;
