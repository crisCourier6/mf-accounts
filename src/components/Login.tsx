import React from "react";
import { Button, Box, TextField, Alert} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useState } from 'react';
// import { DevTool } from '@hookform/devtools';

type FormValues = {
    email: string
    password: string
}



const Login: React.FC = () => {
    const navigate = useNavigate()
    const form = useForm<FormValues>({
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

    const onSubmit = (data: FormValues) => {
        console.log(data)
        axios.post(url, {
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
            if (error.response.status == 401){
                setErrorText("Credenciales inválidas")
            }

            else if (error.response.status == 403){
                setErrorText("Cuenta no activada")
            }
        })

    }

    return  <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
        sx={{
            pt: 2,
            pb: 10,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            py: 2,
            gap: 5
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
            />

            <TextField 
                id="password" 
                label="Contraseña" 
                type="password" 
                variant="standard" 
                {...register("password", {required: "Ingresar contraseña"})}
                error={!!errors.password}
                helperText = {errors.password?.message}
            />

            <Button type="submit" variant="contained" > Iniciar sesión</Button>
            
            <Alert severity="error" sx={{display: showError?null:"none"}} >{errorText}</Alert>
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default Login