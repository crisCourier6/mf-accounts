import React from "react";
import { Button, Box, Alert} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { DevTool } from '@hookform/devtools';


const Activate: React.FC = () => {
    const navigate = useNavigate()
    const { id, token } = useParams()
    const [activeStatus, setActiveStatus] = useState(false)
    const handleSendMail = () =>{
        return console.log("mail")
    }

    const handleLogin = () =>{
        return navigate("/login")
    }
    useEffect(()=>{
        const url = "http://192.168.100.6:8080/activate/" + id + "/" + token
        axios.get(url, {
            withCredentials: true,
        })
        .then((res)=>{
            console.log(res.data)
            setActiveStatus(res.data)
                                
        }).catch((error) => {
            console.log(error)
        })
    },[id])              

    

    const ExpiredTokenDialog = (<>
        <Alert severity="warning">
            Este enlace de activación de cuenta ha expirado.
        </Alert>
        <Button onClick={handleSendMail}> 
            Enviar nuevo enlace a mi correo
        </Button>
        </>
    )

    const SuccessDialog = (<>
        <Alert severity="success">
            Tu cuenta ha sido activada!
        </Alert>
        <Button onClick={handleLogin}> 
            Ir a iniciar sesión
        </Button>
        </>

    )

    return <>
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
            <Box>
                {activeStatus && SuccessDialog}
            </Box>
            <Box>
                {!activeStatus && ExpiredTokenDialog}
            </Box>
            </Box>
        </>
  
}

export default Activate