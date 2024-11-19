import React, {useEffect, useState} from "react";
import { Button, Box, Alert, CircularProgress} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";
// import { DevTool } from '@hookform/devtools';


const Activate: React.FC = () => {
    const navigate = useNavigate()
    const { id, token } = useParams()
    const [activeStatus, setActiveStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    const [allDone, setAllDone] = useState(false)
    useEffect(()=>{
        const url = "/activate/" + id + "/" + token
        document.title = `Activación de cuenta - EyesFood`
        api.get(url, {
            withCredentials: true,
        })
        .then((res)=>{
            console.log(res.data)
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
        return console.log("mail")
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
                <Alert severity="success">
                    Tu cuenta ha sido activada!
                </Alert>
                <Button onClick={handleLogin}> 
                    Ir a iniciar sesión
                </Button>
                </>
                :<>
                <Alert severity="warning">
                   {errorMessage}
                </Alert>
                {errorMessage.includes("expiró") && <Button onClick={handleSendMail}> 
                    Enviar nuevo enlace a mi correo
                </Button>}
                {errorMessage.includes("activo") && <Button onClick={handleLogin}> 
                    Ir a iniciar sesión
                </Button>}
                </>}
            </Box>
        
        :<CircularProgress/>
    )
}

export default Activate