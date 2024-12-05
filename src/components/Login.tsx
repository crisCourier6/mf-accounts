import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Alert, InputAdornment, IconButton, FormGroup, FormControlLabel, Checkbox, CircularProgress} from '@mui/material';
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
        mode: "onBlur",
        reValidateMode: "onBlur",
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
    const [loggingIn, setLoggingIn] = useState(false)
    const queryParams = "?r=Core"

    useEffect(() => {
        document.title = "Iniciar sesión - EyesFood";
    }, []); // Empty dependency array to ensure it runs only once on mount

    const onSubmit = (data: FormValues) => {
        setLoggingIn(true)
        api.post(`${url}${queryParams}`, {
            email: data.email,
            pass: data.password
        }, {
            withCredentials: true,
        })
        .then((res)=>{
            console.log(res.data)
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
            gap: 5,
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
                inputProps={{maxLength: 100}}
                fullWidth
            />

            <FormGroup>
                <FormControlLabel control={<Checkbox checked={keepLogin} onChange={()=>setKeepLogin(!keepLogin)}/>} label="Mantener sesión iniciada" />
            </FormGroup>

            {loggingIn
                ?<CircularProgress/>
                :<Button type="submit" variant="contained" sx={{width: "100%"}} > Iniciar sesión</Button>
            }
            
            <Alert severity="error" sx={{display: showError?null:"none"}} >{errorText}</Alert>
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default Login