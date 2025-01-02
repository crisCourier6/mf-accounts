import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box, DialogActions, 
    Button, Divider, TextField, FormControlLabel, Checkbox, FormGroup, SnackbarCloseReason, Snackbar, Alert, Tooltip } from '@mui/material';
import api from '../api';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Role } from '../interfaces/Role';
import { RoleHasPermission } from '../interfaces/RoleHasPermission';
import { Permission } from '../interfaces/Permission';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';

interface RoleProfileProps {
    role: Role;
    open: boolean;
    permissions: Permission[]
    onClose: () => void;
    onUpdate: (updatedRole:Role) => void;
    onAddPermission: (newPermission:Permission) => void;
    onDeletePermission: (deletedPermission:Permission) => void;
    onUpdatePermission: (updatedPermission:Permission) => void;
}

type PermissionValues = {
    name: string,
    description: string
}

const RoleDetails: React.FC<RoleProfileProps> = ({ role, open, onClose, onUpdate, onAddPermission, onDeletePermission, onUpdatePermission, permissions}) => {
    const [showRemovePermissionDialog, setShowRemovePermissionDialog] = useState(false)
    const [showEditPermissionDialog, setShowEditPermissionDialog] = useState(false)
    const [showCreatePermissionDialog, setShowCreatePermissionDialog] = useState(false)
    const [showChangePermissionDialog, setShowChangePermissionDialog] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]); // Track selected Permission objects
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState("")
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const rolesURL = "/roles"
    const permissionsURL = "/permissions"
    const permissionForm = useForm<PermissionValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            description: ""
        }
    });
    const { register: registerPermission, handleSubmit: handleSubmitPermission, formState: permissionFormState } = permissionForm;
    const { errors: permissionErrors, isValid: isPermissionValid } = permissionFormState;

    useEffect(()=>{
        if (role.roleHasPermission) {
            const initialPermissions = role.roleHasPermission.map((roleHasPermission: RoleHasPermission) => roleHasPermission.permission);
            setSelectedPermissions(initialPermissions.filter(Boolean) as Permission[]); // Ensure no null values
        }
    },[role])

    const handlePermissionToggle = (permission: Permission) => {
        setSelectedPermissions((prev) =>
            prev.some((p) => p.id === permission.id)
                ? prev.filter((p) => p.id !== permission.id) // Remove if already selected
                : [...prev, permission] // Add if not selected
        );
    };

    const handleChangePermissions = () => {
        api.post(`${rolesURL}/${role.id}/permissions`,
            {
                roleHasPermissions: selectedPermissions
            }, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.token || window.localStorage.token
                }
            }
        )
        .then(res => {
            console.log(res)
            onUpdate(res.data)
            setSnackbarMsg("Permisos actualizados")
        })
        .catch(error =>{
            console.log(error)
            setSnackbarMsg(error.response.data.message)
        })
        .finally(()=>{
            setSnackbarOpen(true)
            setShowChangePermissionDialog(false)
        })
       
    };

    const handleCreatePermission = (data: PermissionValues) => {
        api.post(`${permissionsURL}`, data, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.sessionStorage.token || window.localStorage.token
            }
        })
        .then((res) => {
            setSnackbarMsg("Permiso creado con éxito")
            onAddPermission(res.data)
        })
        .catch((error) => {
            setSnackbarOpen(true)
            setSnackbarMsg(error.response.data.message)
        })
        .finally(()=>{
            setSnackbarOpen(true)
            setShowCreatePermissionDialog(false)
        })
    };

    const handleOpenEditPermission = (permission: Permission) => {
        setSelectedPermission(permission)
        const { name, description } = permission
        permissionForm.reset({name, description})
        setShowEditPermissionDialog(true)
    }

    const handleCloseEditPermission = () => {
        setShowEditPermissionDialog(false)
        permissionForm.reset({name: "", description: ""})
        setSelectedPermission(null)
    }

    const handleEditPermission = (data: PermissionValues) => {
        if (selectedPermission) {
            api.patch(`${permissionsURL}/${selectedPermission.id}`, data, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.token || window.localStorage.token
                }
            })
            .then(res=>{
                setSnackbarMsg("Permiso modificado con éxito")
                onUpdatePermission(res.data)
            })
            .catch(error => {
                setSnackbarOpen(true)
                setSnackbarMsg(error.response.data.message)
            })
            .finally(()=>{
                setSnackbarOpen(true)
                setShowEditPermissionDialog(false) 
            })
        }
    };

    const handleDeletePermission = () => {
        if (selectedPermission){
            api.delete(`${permissionsURL}/${selectedPermission.id}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.sessionStorage.token || window.localStorage.token
                }
            })
            .then(res => {
                console.log(res)
                setSnackbarMsg("Permiso eliminado con éxito")
                onDeletePermission(selectedPermission)
            })
            .catch(error => {
                setSnackbarOpen(true)
                setSnackbarMsg(error.response.data.message)
            })
            .finally(()=>{
                setSnackbarOpen(true)
                setShowRemovePermissionDialog(false);
            })
        }
        
    };

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
    }
    
    return ( <>
        <Dialog 
        open={open} 
        onClose={onClose} 
        sx={{border: "2px solid", borderColor: "secondary.main"}}
        PaperProps={{
            sx: {
                maxHeight: '80vh', 
                width: "100vw",
                maxWidth: "500px",
                margin:0,
                border: "2px solid", borderColor: "secondary.main"
            }
        }}>
            <DialogTitle sx={{padding:0.5, bgcolor: "primary.dark"}}>
            <Box sx={{display:"flex", justifyContent: "space-between", color: "primary.contrastText"}}>
                ROL: {role.name}
                <IconButton
                color="inherit"
                onClick={onClose}
                sx={{p:0}}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            </DialogTitle>
            <DialogContent dividers sx={{padding:1}}>
                <Typography variant='h6' width="100%"  color="primary.dark" textAlign={"left"}>
                        DESCRIPCIÓN
                </Typography>
                <Typography variant="subtitle1" textAlign={"justify"} sx={{py:1}}>
                    {role.description}
                </Typography>
                <Divider sx={{my:1}}/>
                <Typography variant='h6' width="100%"  color="primary.dark" textAlign={"left"}>
                        PERMISOS
                </Typography>
                {
                    role.roleHasPermission?.map((roleHasPermission:RoleHasPermission) => 
                        <Box key={roleHasPermission.permission?.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='subtitle1' 
                                        color= "primary.dark" 
                                        sx={{py:1}}
                            >
                                <strong>{roleHasPermission.permission?.name}</strong>: {roleHasPermission.permission?.description}
                            </Typography>   
                            
                        </Box>
                    )
                }
            </DialogContent>
            <DialogActions>
                
                <Button onClick={() => setShowChangePermissionDialog(true)}
                    variant="contained"
                >
                    Cambiar permisos
                </Button>
            </DialogActions>
        </Dialog>
        {/* Add Permissions Dialog */}
            <Dialog
            open={showChangePermissionDialog}
            onClose={() => setShowChangePermissionDialog(false)}
            PaperProps={{ sx: { maxWidth: "500px", width: "95vw", }}}
        >
            <DialogTitle>Cambiar permisos de rol {role.name}</DialogTitle>
            <DialogContent>
                <FormGroup>
                        {permissions.map((permission: Permission) => (<div key={permission.id}>
                            <Box  sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                                <FormControlLabel
                                    key={permission.id}
                                    control={ 
                                        <Checkbox 
                                            checked={selectedPermissions.some(p => p.id === permission.id)}
                                            onChange={() => handlePermissionToggle(permission)}
                                        />
                                    }
                                    label={permission.name}
                                ></FormControlLabel>
                                <Box sx={{display: "flex", justifyContent:"right", alignItems: "right", flexWrap: "wrap"}}>
                                    <Tooltip title="Modificar permiso" key="edit" placement="left" arrow={true}>
                                        <IconButton onClick={() => {handleOpenEditPermission(permission)}}>
                                            <EditIcon sx={{color: "primary.dark"}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar permiso" key="delete" placement="right" arrow={true}>
                                        <IconButton onClick={() => {
                                            setSelectedPermission(permission || null);
                                            setShowRemovePermissionDialog(true);
                                        }}>
                                            <DeleteForeverRoundedIcon sx={{color: "error.main"}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Divider/>
                            </div>
                        ))}
                </FormGroup>
                <Button onClick={() => setShowCreatePermissionDialog(true)} variant="text" fullWidth>
                    <AddIcon fontSize='small'/>
                    Crear permiso
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowChangePermissionDialog(false)}>Cancelar</Button>
                
                <Button variant="contained" onClick={handleChangePermissions}>Guardar</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={showCreatePermissionDialog} onClose={()=>setShowCreatePermissionDialog(false)} 
        PaperProps={{
            sx: {
                maxHeight: '80vh', 
                width: "85vw",
                maxWidth: "450px",
            }
        }} >
            <DialogTitle sx={{bgcolor: "primary.dark", color: "primary.contrastText"}}>
                Crear permiso
            </DialogTitle>
            <DialogContent sx={{
                padding:0.5,
                flex: 1, 
                overflowY: 'auto'
            }}>
                <form onSubmit={handleSubmitPermission(handleCreatePermission)}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        {...registerPermission("name", {required: "Ingresar nombre"})}
                        error={!!permissionErrors.name}
                        inputProps={{maxLength: 100}}
                        helperText={permissionErrors.name?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        {...registerPermission("description")}
                        error={!!permissionErrors.description}
                        helperText={permissionErrors.description?.message}
                        inputProps={{maxLength: 100}}
                        margin="normal"
                    />
                    <DialogActions>
                        <Button onClick={()=>{setShowCreatePermissionDialog(false)}}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={!isPermissionValid}>Guardar</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>        
        <Dialog open={showRemovePermissionDialog} onClose={() => setShowRemovePermissionDialog(false)}>
            <DialogTitle>Borrar permiso {selectedPermission?.name}</DialogTitle>
            <DialogContent>  
                ¿Seguro que desea borrar este permiso? 
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowRemovePermissionDialog(false)} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleDeletePermission} variant="contained" color="primary">
                    Borrar
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={showEditPermissionDialog} onClose={handleCloseEditPermission} 
        PaperProps={{
            sx: {
                maxHeight: '80vh', 
                width: "85vw",
                maxWidth: "450px"
            }
        }} >
            <DialogTitle sx={{bgcolor: "primary.dark", color: "primary.contrastText"}}>
                Modificar permiso
            </DialogTitle>
            <DialogContent sx={{
                padding:0.5,
                flex: 1, 
                overflowY: 'auto'
            }}>
                <form onSubmit={handleSubmitPermission(handleEditPermission)}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        {...registerPermission("name", {required: "Ingresar nombre"})}
                        error={!!permissionErrors.name}
                        helperText={permissionErrors.name?.message}
                        inputProps={{maxLength: 100}}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        {...registerPermission("description")}
                        error={!!permissionErrors.description}
                        helperText={permissionErrors.description?.message}
                        inputProps={{maxLength: 100}}
                        margin="normal"
                    />
                    <DialogActions>
                        <Button onClick={handleCloseEditPermission}>Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={!isPermissionValid}>Guardar</Button>
                    </DialogActions>
                </form>
            </DialogContent>
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
    </>);
};

export default RoleDetails;