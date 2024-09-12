import React, { useEffect } from "react";
import { Button, Box, TextField, Alert, InputAdornment, IconButton} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useState } from 'react';
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { DevTool } from '@hookform/devtools';

type FormValues = {
    email: string
    password: string
}

const LoginAdmin: React.FC = () => {
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
    const url = "http://192.168.100.6:8080/auth/login"
    const { register, handleSubmit, formState, control } = form
    const {errors} = formState
    const [showPass, setShowPass] = useState(false)

    const onSubmit = (data: FormValues) => {
        console.log(data)
        axios.post(url + "?v=admin", {
            email: data.email,
            pass: data.password
        }, {withCredentials: true})
        .then((res)=>{
            console.log(res.status)
            if(res.data.name){
                window.localStorage.setItem("id", res.data.id)
                window.localStorage.setItem("name", res.data.name)
                window.localStorage.setItem("email", res.data.email)
                window.localStorage.setItem("roles", res.data.roles)
                window.localStorage.setItem("token", res.data.token)
                return navigate("/home")
            }
            setShowError(true)
            
        }).catch((error) => {
            console.log(error.response)
            setShowError(true)
            setErrorText(error.response.data.message)
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

            <Button type="submit" variant="contained" sx={{width: "100%"}} > Iniciar sesión</Button>
            
            <Alert severity="error" sx={{display: showError?null:"none"}} >{errorText}</Alert>
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default LoginAdmin