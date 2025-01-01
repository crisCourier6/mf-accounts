import React, { useEffect, useState } from "react";
import { Box, Paper, Grid, Typography} from '@mui/material';
// import { DevTool } from '@hookform/devtools';
import "./Components.css"
import { User } from "../interfaces/User";

const UserAccountEdit: React.FC<{selectedUser:User}> = (params) => {
    const [user, setUser] = useState<User>({id:""})
    useEffect(()=>{
       setUser(params.selectedUser)
    },[params])

    return <Grid container 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        bgcolor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        color: params.selectedUser.isActive? "primary.contrastText" : "warning.contrastText",
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
                        {/* <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Rol: </span>{user.userHasRole?.map((userRole: any) => userRole.role?.name).filter(Boolean).join(", ")}</li>
                        </Typography> */}
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
                        {/* <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>¿Suspendida?: </span>{user.isSuspended?"Sí":"No"}</li>
                        </Typography>  */}
                    </ul>
                    </Paper>

                </Box>

                {user.expertProfile && <Box
                sx={{
                    border: "5px solid",
                    borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        bgcolor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        color: params.selectedUser.isActive? "primary.contrastText" : "warning.contrastText",
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
                            <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.expertProfile.description}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Especialización: </span>{user.expertProfile.specialty}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.expertProfile.address}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Teléfono: </span>{user.expertProfile.phone}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Página web: </span>
                                {user.expertProfile.webPage?<a 
                                    href={user.expertProfile.webPage?.startsWith('http')? user.expertProfile.webPage : `https://${user.expertProfile.webPage}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'blue', textDecoration: 'none' }}
                                >
                                    Ver página web
                            </a>:<>Sin página web</>}
                            </li>
                        </Typography> 
                        {user.expertProfile.isNutritionist && <Typography variant='subtitle1' color= "primary.dark">Nutricionista</Typography>}
                        {user.expertProfile.isCoach && <Typography variant='subtitle1' color= "primary.dark">Coach</Typography>}
                    </ul>
                    </Paper>

                </Box>
            }
            {user.storeProfile && <Box
                sx={{
                    border: "5px solid",
                    borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        borderColor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        bgcolor: params.selectedUser.isActive? "secondary.dark" : "warning.dark",
                        color: params.selectedUser.isActive? "primary.contrastText" : "warning.contrastText",
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
                            <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.storeProfile.description}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.storeProfile.address}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Teléfono: </span>{user.storeProfile.phone}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                        <li><span style={{fontWeight: "bold"}}>Página web: </span>
                                {user.storeProfile.webPage?<a 
                                    href={user.storeProfile.webPage?.startsWith('http')? user.storeProfile.webPage : `https://${user.storeProfile.webPage}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'blue', textDecoration: 'none' }}
                                >
                                    Ver página web
                            </a>:<>Sin página web</>}
                            </li>
                        </Typography> 
                    </ul>
                    </Paper>
                </Box>
            }
        </Grid>
  
}

export default UserAccountEdit