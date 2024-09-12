import React from "react";
import { Button, Box, Alert, Paper, Grid, Backdrop, Dialog, DialogContent, DialogActions, TextField, Snackbar, SnackbarCloseReason, InputAdornment, IconButton, Typography} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { DevTool } from '@hookform/devtools';
import { UserFull } from "../interfaces/UserFull";
import "./Components.css"
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type UserValues = {
    id:string
    email?:string
    name?:string
    hash?:string
    isActive?:boolean
    isSuspended?:boolean
    isPending?:boolean
    isCoach?:boolean
    isNutritionist?:boolean
    address?:string
    description?:string
    phone?:string
    specialty?:string
    webPage?:string
    activationToken?:string
    activationExpire?:Date
    profilePic?:string
    typeExternal?:string
    externalId?:string
    lastLogin?:Date
    createdAt?:Date
    updatedAt?:Date
    roles?:string
}

const UserAccountEdit: React.FC<{selectedUser:UserValues}> = (params) => {
    const navigate = useNavigate()
    const [user, setUser] = useState<UserValues>({id:""})
    const [successOpen, setSuccessOpen] = useState(false)
    const [passErrorOpen, setPassErrorOpen] = useState(false)
    const [isActive, setIsActive] = useState<boolean | undefined>(false)
    const [isSuspended, setIsSuspended] = useState<boolean | undefined>(false)
    const [isPending, setIsPending] = useState<boolean | undefined>(false)

    const url = "http://192.168.100.6:8080/users/" + params.selectedUser.id
    useEffect(()=>{
       setUser(params.selectedUser)
    },[params])

    useEffect(()=>{
        setIsActive(user.isActive)
        setIsSuspended(user.isSuspended)
        setIsPending(user.isPending)
    },[user])

    const handleSuccessClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSuccessOpen(false);
      }

    return <Grid container 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Información general
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                    <ul style={{ paddingLeft: 10 }}>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Nombre: </span>{user.name}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Email: </span>{user.email}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Rol: </span>{user.roles}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Miembro desde: </span>{user.createdAt?.toLocaleDateString("es-CL", )}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Último ingreso: </span>{user.lastLogin?.toLocaleDateString("es-CL", )}</li>
                        </Typography> 
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Estado: </span>{user.isActive?"Activada":"Desactivada"}</li>
                        </Typography> 
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>¿Pendiente?: </span>{user.isPending?"Sí":"No"}</li>
                        </Typography> 
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>¿Suspendida?: </span>{user.isSuspended?"Sí":"No"}</li>
                        </Typography> 
                    </ul>
                    </Paper>

                </Box>

                {user.roles?.includes("Expert") && <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Perfil de experto
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                    <ul style={{ paddingLeft: 10 }}>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.description}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Especialización: </span>{user.specialty}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.address}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Teléfono: </span>{user.phone}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Página web: </span>{user.webPage}</li>
                        </Typography> 
                        {user.isNutritionist && <Typography variant='subtitle1' color= "primary.dark">Nutricionista</Typography>}
                        {user.isCoach && <Typography variant='subtitle1' color= "primary.dark">Coach</Typography>}
                    </ul>
                    </Paper>

                </Box>
            }
            {user.roles?.includes("Store") && <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Perfil de tienda
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                    <ul style={{ paddingLeft: 10 }}>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.description}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.address}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Teléfono: </span>{user.phone}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Página web: </span>{user.webPage}</li>
                        </Typography> 
                    </ul>
                    </Paper>
                </Box>
            }
        </Grid>
  
}

export default UserAccountEdit