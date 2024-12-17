import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Alert, InputAdornment, IconButton, FormGroup, FormControlLabel, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { DevTool } from '@hookform/devtools';

type FormValues = {
    email: string
    password: string
}



const Login: React.FC = () => {
    const navigate = useNavigate()
    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        }
    })   
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const url = "/auth/login"
    const { register, handleSubmit, formState } = form
    const {errors} = formState
    const [keepLogin, setKeepLogin] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showPassResetDialog, setShowPassResetDialog] = useState(false)
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    const [loggingIn, setLoggingIn] = useState(false)
    const [email, setEmail] = useState("")
    const queryParams = "?r=Core"

    useEffect(() => {
        document.title = "Iniciar sesión - EyesFood";
    }, []); // Empty dependency array to ensure it runs only once on mount

    const handlePassReset = () => {
        setShowPassResetDialog(true)
    }

    const onSubmit = (data: FormValues) => {
        setLoggingIn(true)
        api.post(`${url}${queryParams}`, {
            email: data.email,
            pass: data.password
        }, {
            withCredentials: true,
        })
        .then((res)=>{
            // console.log(res.data)
            if(keepLogin){
                window.localStorage.setItem("id", res.data.id)
                window.localStorage.setItem("name", res.data.name)
                window.localStorage.setItem("email", res.data.email)
                window.localStorage.setItem("token", res.data.token)
                window.localStorage.setItem("roles", res.data.roles)
                if (res.data.externalId){
                    window.localStorage.setItem("g_auth", res.data.externalId)
                }
                if (res.data.expertProfile){
                    window.localStorage.setItem("e_id", res.data.expertProfile.id)
                }
                if (res.data.storeProfile){
                    window.localStorage.setItem("s_id", res.data.storeProfile.id)
                }
                return navigate("/home")
            }
            else{
                window.sessionStorage.setItem("id", res.data.id)
                window.sessionStorage.setItem("name", res.data.name)
                window.sessionStorage.setItem("email", res.data.email)
                window.sessionStorage.setItem("token", res.data.token)
                window.sessionStorage.setItem("roles", res.data.roles)
                if (res.data.externalId){
                    window.sessionStorage.setItem("g_auth", res.data.externalId)
                }
                if (res.data.expertProfile){
                    window.sessionStorage.setItem("e_id", res.data.expertProfile.id)
                }
                if (res.data.storeProfile){
                    window.sessionStorage.setItem("s_id", res.data.storeProfile.id)
                }
                return navigate("/home")
            }
            
        }).catch((error) => {
            console.log(error)
            setShowError(true)
            setErrorText(error.response.data.message)
            setLoggingIn(false)
        })

    }

    const handleResetPassword = () => {
        setResetLoading(true);
        setResetError("");
        setResetSuccess("");
    
        api
          .post("/auth/resetpass", { email: resetEmail })
          .then(() => {
            setResetSuccess("Se ha enviado un enlace de recuperación a tu correo.");
            setResetEmail(""); // Clear the email field
          })
          .catch((error) => {
            setResetError(
              error.response?.data.message || "Error al enviar el correo."
            );
          })
          .finally(() => setResetLoading(false));
      };

    return  <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
        sx={{
            pt: 2,
            pb: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            py: 2,
            gap:1,
            width:"100%"
        }}     
        >
       
            <TextField 
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                {...register("email", {required: "Ingresar email"})}
                error={!!errors.email}
                helperText = {errors.email?.message}
                fullWidth
                inputProps={{maxLength: 100}}
                sx={{py:1}}
            />

            <TextField 
                id="password" 
                label="Contraseña" 
                type={showPass ? 'text' : 'password'}
                variant="standard" 
                {...register("password", {required: "Ingresar contraseña"})}
                error={!!errors.password}
                helperText = {errors.password?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            onClick={()=>setShowPass(!showPass)}
                            aria-label="toggle password visibility"
                        >
                            {showPass? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{py:1}}
                inputProps={{maxLength: 100}}
                fullWidth
            />
            <Button variant="text" onClick={handlePassReset}>
                <Typography variant="subtitle2" sx={{textDecoration: "underline"}}>
                    Olvidé mi contraseña
                </Typography>
            </Button>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={keepLogin} onChange={()=>setKeepLogin(!keepLogin)}/>} label="Mantener sesión iniciada" />
            </FormGroup>
            {loggingIn
                ?<CircularProgress/>
                :<Button type="submit" variant="contained" sx={{width: "100%"}} > Iniciar sesión</Button>
            }
            
            <Alert variant="filled" severity="error" sx={{display: showError?null:"none"}} >{errorText}</Alert>
            {/* Reset Password Dialog */}
            <Dialog
                open={showPassResetDialog}
                onClose={() => setShowPassResetDialog(false)}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh', 
                        width: "85vw",
                        maxWidth: "450px"
                    }
                }} 
            >
                <DialogTitle>Restablecer contraseña</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1">
                        Ingresa el correo asociado a tu cuenta EyesFood. Te enviaremos un enlace donde podrás establecer una contraseña nueva.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reset-email"
                        label="Correo electrónico"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    {resetError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                        {resetError}
                        </Alert>
                    )}
                    {resetSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                        {resetSuccess}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setShowPassResetDialog(false)}>Cerrar</Button>
                <Button
                    onClick={handleResetPassword}
                    disabled={!resetEmail || resetLoading}
                    variant="contained"
                >
                    {resetLoading ? <CircularProgress size={20} /> : "Enviar"}
                </Button>
                </DialogActions>
            </Dialog>
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default Login