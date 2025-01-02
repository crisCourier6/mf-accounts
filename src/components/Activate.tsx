import React, {useEffect, useState} from "react";
import { Button, Box, Alert, CircularProgress, Typography} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";


const Activate: React.FC = () => {
    const navigate = useNavigate()
    const { id, token } = useParams()
    const [activeStatus, setActiveStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [reset, setReset] = useState(false)
    
    const [allDone, setAllDone] = useState(false)
    useEffect(()=>{
        const url = "/activate/" + id + "/" + token
        document.title = `Activación de cuenta - EyesFood`
        api.get(url, {
            withCredentials: true,
        })
        .then((res)=>{
            setActiveStatus(res.data.isActive)
                                
        })
        .catch((error) => {
            setErrorMessage(error.response.data.message)
        })
        .finally(()=>{
            setAllDone(true)
        })
    },[id, token])              

    const handleSendMail = () =>{
        const url = "/activate/" + id + "/" + token + "/reset"
        api.get(url, {
            withCredentials: true,
        })
        .then((res)=>{
            setReset(true)              
        })
        .catch((error) => {
            setErrorMessage(error.response.data.message)
        })
    }
    const handleLogin = () =>{
        return navigate("/login")
    }

    return (allDone? 
            <Box
            sx={{
                pt: 2,
                pb: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                py: 2,
                gap: 5
            }}
            > 
                {activeStatus  
                ?<>
                <Alert severity="success" variant="filled">
                    Tu cuenta ha sido activada!
                </Alert>
                <Button onClick={handleLogin}> 
                    Ir a iniciar sesión
                </Button>
                </>
                :<>
                <Alert severity="warning" variant="filled">
                   {errorMessage}
                </Alert>
                {errorMessage.includes("expiró") && 
                    <Button onClick={handleSendMail} disabled={reset}> 
                        Enviar nuevo enlace a mi correo
                    </Button>
                }
                {reset && 
                    <Typography variant="subtitle1">
                        Nuevo enlace envíado!
                    </Typography>
                }
                {errorMessage.includes("activo") && <Button onClick={handleLogin}> 
                    Ir a iniciar sesión
                </Button>}
                </>}
            </Box>
        
        :<CircularProgress/>
    )
}

export default Activate