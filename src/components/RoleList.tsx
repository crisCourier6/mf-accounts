import React, { useEffect, useState }  from 'react';
import api from '../api';
import { Box, Card, CardContent, Grid, IconButton, Typography, Alert, Button, Dialog, 
    DialogActions, DialogContent, TextField, Snackbar, SnackbarCloseReason, CardActions, DialogTitle, Tooltip, CircularProgress } from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Role } from '../interfaces/Role';
import RoleDetails from './RoleDetails';
import { useForm } from 'react-hook-form';
import { Permission } from '../interfaces/Permission';

type RoleValues = {
    name: string,
    description: string
}

const RoleList: React.FC<{ isAppBarVisible: boolean }> = ({ isAppBarVisible }) => {
    const rolesURL = "/roles"
    const permissionsURL = "/permissions"
    const token = window.sessionStorage.token || window.localStorage.token
    const [roles, setRoles] = useState<Role[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [showEditForm, setShowEditForm] = useState(false)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState("")
    const [allDone, setAllDone] = useState(false)
    const [openRole, setOpenRole] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const essentialRoles = ["Admin", "Core", "Tech", "Store", "Expert"]
    const queryParams = "?wp=true"
    const roleForm = useForm<RoleValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            description: ""
        }
    });
    const { register: registerRole, handleSubmit: handleSubmitRole, formState: roleFormState } = roleForm;
    const { errors: roleErrors, isValid: isRoleValid } = roleFormState;

    useEffect(() => {
        document.title = "Roles - EF Admin";
        const fetchRoles = api.get(`${rolesURL}${queryParams}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })

        const fecthPermissions = api.get(`${permissionsURL}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })

        Promise.all([fetchRoles, fecthPermissions])
        .then(([rolesResponse, permissionsResponse]) =>{
            const rolesData = rolesResponse.data
            const permissionsData = permissionsResponse.data
            setRoles(rolesData)
            setPermissions(permissionsData)
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        })
        .finally(() => {
            setAllDone(true); // Set the flag after both requests have completed
        });

    
    }, []);

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
      }
    const handleOpenRole = (role: Role) => {
        setSelectedRole(role)
        setOpenRole(true)
    };

    const handleCloseRole = () => {
        setOpenRole(false);
        setSelectedRole(null);
    };

    const handleDeleteRole = (role: Role) => {
        setSelectedRole(role)
        setShowDeleteDialog(true)
    }

    const handleOpenRoleForm = (role: Role) => {
        setSelectedRole(role)
        const { name, description } = role
        roleForm.reset({name, description})
        setShowEditForm(true)
    }

    const handleCloseRoleForm = () => {
        setShowEditForm(false)
        setSelectedRole(null)
    }

    const handleOpenCreateRole = () => {
        roleForm.reset({name: "", description: ""})
        setShowCreateForm(true)
    }

    const handleCloseCreateRole = () => {
        setShowCreateForm(false)
        setSelectedRole(null)
    }

    const onCreateRole = (data: RoleValues) => {
        console.log(data)
        api.post(`${rolesURL}`, data, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res) => {
            setSnackbarOpen(true);
            setSnackbarMsg("Rol creado con éxito")
            setRoles((prevRoles) => [...prevRoles, res.data] )
            handleCloseCreateRole()
        })
        .catch((error) => {
            console.error(error);
            setSnackbarOpen(true)
            setSnackbarMsg(error.message)
            handleCloseCreateRole()
        });
    };

    const onEditRole = (data: RoleValues) => {
        console.log(data)
        api.patch(`${rolesURL}/${selectedRole?.id}`, data, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res) => {
            setSnackbarOpen(true);
            setSnackbarMsg("Rol modificado con éxito")
            setRoles((prevRoles) => 
                prevRoles.map((role) =>
                    role.id===res.data.id ? res.data : role
                )
            )
            handleCloseRoleForm()
        })
        .catch((error) => {
            console.error(error);
            setSnackbarOpen(true)
            setSnackbarMsg(error.message)
            handleCloseRoleForm()
        });
    };

    const onDeleteRole = () => {
        api.delete(`${rolesURL}/${selectedRole?.id}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            console.log(res)
            setSnackbarOpen(true)
            setSnackbarMsg(`Rol eliminado con éxito`)
            setRoles(roles.filter((role: Role) => role.id !== selectedRole?.id))
            setShowDeleteDialog(false)
            
        })
        .catch(error =>{
            console.log(error.message)
            setSnackbarOpen(true)
            setSnackbarMsg(error.message)
            handleCloseRoleForm()
        })
    }

    const updateRoleInList = (updatedRole:Role) => {
        setRoles((prevRoles) =>
            prevRoles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
        );
        setSelectedRole(updatedRole); // Update the selected role
    };

    const addPermissionToList = (newPermission:Permission) => {
        setPermissions((prevPermissions) => [...prevPermissions, newPermission]);
    };

    const updatePermissionInList = (updatedPermission:Permission) => {
        setPermissions((prevPermissions) =>
            prevPermissions.map((permission) => (permission.id === updatedPermission.id ? updatedPermission : permission))
        );
        setRoles((prevRoles) =>
            prevRoles.map((role) => {
                // Find and update the role's permissions if they reference the updated permission
                const updatedRolePermissions = role.roleHasPermission?.map((roleHasPermission) => {
                    return roleHasPermission.permission?.id === updatedPermission.id
                        ? { ...roleHasPermission, permission: updatedPermission }
                        : roleHasPermission;
                });
    
                return { ...role, roleHasPermission: updatedRolePermissions };
            })
        );
        if (selectedRole) {
            const updatedSelectedRolePermissions = selectedRole.roleHasPermission?.map((roleHasPermission) => {
                return roleHasPermission.permission?.id === updatedPermission.id
                    ? { ...roleHasPermission, permission: updatedPermission }
                    : roleHasPermission;
            });
            setSelectedRole({ ...selectedRole, roleHasPermission: updatedSelectedRolePermissions });
        }
    };

    const deletePermissionInList = (deletedPermission:Permission) => {
        setPermissions((prevPermissions) =>
            prevPermissions.filter((permission) => (permission.id !== deletedPermission.id))
        )
        setRoles((prevRoles) =>
            prevRoles.map((role) => {
                // Filter out the roleHasPermission entries that reference the deleted permission
                const updatedRolePermissions = role.roleHasPermission?.filter(
                    (roleHasPermission) => roleHasPermission.permission?.id !== deletedPermission.id
                );
    
                return { ...role, roleHasPermission: updatedRolePermissions };
            })
        );
        if (selectedRole) {
            const updatedSelectedRolePermissions = selectedRole.roleHasPermission?.filter(
                (roleHasPermission) => roleHasPermission.permission?.id !== deletedPermission.id
            );
            setSelectedRole({ ...selectedRole, roleHasPermission: updatedSelectedRolePermissions });
        }
    };

    return ( allDone?
        <Grid container display="flex" 
        flexDirection="column" 
        justifyContent="center"
        alignItems="center"
        sx={{width: "100vw", gap:2, flexWrap: "wrap", pb: 7}}
        >
            <Box 
                sx={{
                    position: 'sticky',
                    top: isAppBarVisible?"50px":"0px",
                    width:"100%",
                    maxWidth: "500px",
                    transition: "top 0.1s",
                    backgroundColor: 'primary.dark', // Ensure visibility over content
                    zIndex: 100,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderBottom: "5px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box"
                  }}
            >
                <Typography variant='h5' width="100%"  color="primary.contrastText" sx={{py:1, borderLeft: "3px solid",
                    borderRight: "3px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box",
                }}>
                    Roles
                </Typography>
            </Box>

            <Box sx={{
                display:"flex", 
                flexDirection:"row", 
                justifyContent:"space-around",
                flexWrap: "wrap",
                alignItems:"stretch",
                width: "100vw", 
                maxWidth:"1000px", 
                gap:"10px"
            }}
            >
            
                { roles.map((role)=>{
                    return (
                    <Card key={role.id} sx={{
                    border: "4px solid", 
                    borderColor: "primary.dark", 
                    bgcolor: "primary.contrastText",
                    width:"90%", 
                    maxWidth: "450px",
                    height: "15vh",
                    maxHeight: "200px", 
                    minHeight: "70px",
                    display:"flex",
                    }}>
                        <CardContent onClick={() => {handleOpenRole(role)}}  
                        sx={{
                        width:"80%",
                        height: "100%", 
                        display:"flex", 
                        flexDirection: "row", 
                        justifyContent: "center",
                        alignItems: "center",
                        padding:0,
                        cursor: "pointer"
                        }}>
                            <Box sx={{
                                width:"100%", 
                                height: "100%",
                                display:"flex", 
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                
                            }}>
                                <Typography 
                                variant="h6" 
                                color="secondary.contrastText" 
                                width="100%" 
                                sx={{alignContent:"center", 
                                    borderBottom: "2px solid", 
                                    borderColor: "primary.main", 
                                    bgcolor: "secondary.main"}}
                                >
                                    {role.name}
                                </Typography>
                                <Typography 
                                variant='subtitle1' 
                                color= "primary.dark" 
                                sx={{
                                    textAlign:"center", 
                                    ml:1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    display: "flex", 
                                    gap:1,
                                    height:"80%"
                                }}>
                                    {role.description}
                                </Typography>                               
                            </Box>
                        </CardContent>
                        <CardActions sx={{padding:0, width:"20%"}}>
                        <Box sx={{
                            width:"100%", 
                            display:"flex", 
                            height: "100%",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "primary.dark",
                            }}>
                                 <Tooltip title="Eliminar rol" key="delete" placement="right" arrow={true}>
                                    <IconButton onClick={()=>handleDeleteRole(role)}>
                                        <DeleteForeverRoundedIcon
                                        sx={{
                                            color:"error.main", 
                                            fontSize: {
                                                xs: 18,   // font size for extra small screens (mobile)
                                                sm: 24,   // font size for large screens (desktops)
                                            }
                                        }}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Modificar rol" key="edit" placement="right" arrow={true}>
                                    <IconButton onClick={()=>handleOpenRoleForm(role)}>
                                        <EditIcon 
                                        sx={{
                                            color:"primary.contrastText", 
                                            fontSize: {
                                                xs: 18,   // font size for extra small screens (mobile)
                                                sm: 24,   // font size for large screens (desktops)
                                            }
                                        }}/>
                                    </IconButton>
                                </Tooltip>
                                <Button onClick={() => {
                                handleOpenRole(role)
                                }} 
                                variant='text' 
                                sx={{color: "secondary.main", 
                                    fontSize: {
                                        xs: 12,   // font size for extra small screens (mobile)
                                        sm: 16,   // font size for large screens (desktops)
                                    }, 
                                    padding:0
                                }}>
                                    Permisos
                                </Button>
                            </Box>
                        </CardActions>
                    </Card> 
                )}
            )}
            {selectedRole && (
                <RoleDetails role={selectedRole} 
                permissions={permissions}
                open={openRole} 
                onClose={handleCloseRole} 
                onUpdate={updateRoleInList}
                onAddPermission={addPermissionToList}
                onUpdatePermission={updatePermissionInList}
                onDeletePermission={deletePermissionInList}
                    />
            )}
            <Dialog open={showEditForm} onClose={handleCloseRoleForm} 
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "85vw",
                    maxWidth: "450px"
                }
            }} >
                <DialogTitle sx={{bgcolor: "primary.dark", color: "primary.contrastText"}}>
                    Modificar rol
                </DialogTitle>
                <DialogContent sx={{
                    padding:0.5,
                    flex: 1, 
                    overflowY: 'auto'
                }}>
                    <form onSubmit={handleSubmitRole(onEditRole)}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            disabled={essentialRoles.includes(selectedRole?.name ?? "")}
                            inputProps={{maxLength: 100}}
                            {...registerRole("name", {required: "Ingresar nombre"})}
                            error={!!roleErrors.name}
                            helperText={roleErrors.name?.message}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            {...registerRole("description")}
                            inputProps={{maxLength: 100}}
                            error={!!roleErrors.description}
                            helperText={roleErrors.description?.message}
                            margin="normal"
                        />
                        <DialogActions>
                            <Button onClick={handleCloseRoleForm}>Cancelar</Button>
                            <Button type="submit" variant="contained" disabled={!isRoleValid}>Guardar</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>    
            <Dialog open={showCreateForm} onClose={handleCloseCreateRole} 
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "85vw",
                    maxWidth: "450px"
                }
            }} >
                <DialogTitle sx={{bgcolor: "primary.dark", color: "primary.contrastText"}}>
                    Crear rol
                </DialogTitle>
                <DialogContent sx={{
                    padding:0.5,
                    flex: 1, 
                    overflowY: 'auto'
                }}>
                    <form onSubmit={handleSubmitRole(onCreateRole)}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            inputProps={{maxLength: 100}}
                            {...registerRole("name", {required: "Ingresar nombre"})}
                            error={!!roleErrors.name}
                            helperText={roleErrors.name?.message}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            inputProps={{maxLength: 100}}
                            {...registerRole("description")}
                            error={!!roleErrors.description}
                            helperText={roleErrors.description?.message}
                            margin="normal"
                        />
                        <DialogActions>
                            <Button onClick={handleCloseCreateRole}>Cancelar</Button>
                            <Button type="submit" variant="contained" disabled={!isRoleValid}>Guardar</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>        

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Borrar rol {selectedRole?.name}</DialogTitle>
                <DialogContent>
                    
                    {selectedRole && essentialRoles.includes(selectedRole.name) && 
                        <>Los roles Core, Admin, Tech, Store y Expert son esenciales para el funcionamiento de EyesFood.</>
                    || <>¿Seguro que desea borrar este rol? </>  
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button disabled={essentialRoles.includes(selectedRole?.name ?? "")} onClick={onDeleteRole} variant="contained" color="primary">
                        Borrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMsg}
            >
                <Alert variant="filled" onClose={handleSnackbarClose} severity={snackbarMsg.includes("Error")?"error":"success"} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
            <Button onClick={handleOpenCreateRole}
                variant="dark" 
                sx={{
                    display: "flex",
                    position: 'fixed',
                    bottom: 0, // 16px from the bottom
                    zIndex: 100, // High zIndex to ensure it's on top of everything
                    height: "48px",
                    width: "50%",
                    maxWidth: "500px"
                }}
            >
                <AddIcon sx={{fontSize: 40}}></AddIcon>
                <Typography variant='subtitle1' color={"inherit"}>
                    Crear rol
                </Typography>
                
            </Button>
        </Box>
   
        </Grid>
        
        :<CircularProgress/>   
    )
}

export default RoleList;