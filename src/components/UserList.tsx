import React from "react";
import { Button, Box, Alert, Grid, Dialog, DialogContent, DialogActions, TextField, 
    Snackbar, InputAdornment, IconButton, Typography, DialogTitle, Tooltip, FormGroup, FormControlLabel, Checkbox,
    List,
    ListItem,
    ListItemText,
    FormHelperText} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener, GridFilterModel, GridRenderCellParams, GridToolbar, GridToolbarContainer, 
    GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector  } from "@mui/x-data-grid"
import { esES } from '@mui/x-data-grid/locales';
import { useForm } from "react-hook-form";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditIcon from '@mui/icons-material/Edit';
import UserAccountEdit from "./UserAccountEdit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from '@mui/icons-material/Add';
import { User } from "../interfaces/User"
import { Role } from "../interfaces/Role";
import { UserHasRole } from "../interfaces/UserHasRole";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PendingIcon from '@mui/icons-material/Pending';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { toUnitless } from "@mui/material/styles/cssUtils";
import NavigateBack from "./NavigateBack";
 
type FormValues = {
    name: string
    email: string
    pass: string
    confirmPassword: string
    profilePic: string
    roles: string[]
    address: string,
    description: string,
    phone: string,
    webPage: string,
    specialty: string,
    isNutritionist: boolean,
    isCoach: boolean
}



const UserList: React.FC<{isAppBarVisible:boolean}> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const usersURL = "/users"
    const rolesURL = "/roles"
    const token = window.sessionStorage.token || window.localStorage.token
    const [users, setUsers] = useState<User[]>([{id:""}])
    const [roles, setRoles] = useState<Role[]>([])
    const [showChangeRolesDialog, setShowChangeRolesDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [reason, setReason] = useState("")
    const [filterModel, setFilterModel] = useState<GridFilterModel>({items: [] });
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [showFlipStateDialog, setShowFlipStateDialog] = useState(false)
    const [page, setPage] = useState(0); // 0 = Role selection, 1 = Form
    const [role, setRole] = useState(["Core"]); // For storing selected role
    const [userTypeName, setUserTypeName] = useState("")
    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            pass: "",
            confirmPassword: "",
            profilePic: "",
            roles: ["Core", "Tech"],
            address: "",
            description: "",
            phone: "",
            webPage: "",
            specialty: "",
            isNutritionist: true,
            isCoach: false
        }
    })   

    const { register, handleSubmit, formState, control, getValues, watch, reset } = form
    const {errors, isValid: isFormValid} = formState
    const password = watch("pass")

    const passwordRequirements = [
        {
          text: "Mínimo 8 caracteres",
          valid: password?.length >= 8,
        },
        {
          text: "Al menos una letra mayúscula",
          valid: /[A-Z]/.test(password || ""),
        },
        {
          text: "Al menos una letra minúscula",
          valid: /[a-z]/.test(password || ""),
        },
        {
          text: "Al menos un número",
          valid: /\d/.test(password || ""),
        },
      ];
    const queryParams = "?ws=true&we=true&wr=true"

    useEffect(()=>{
        document.title = "Usuarios - EF Admin";
        
        api.get(`${usersURL}${queryParams}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res)=>{
            const transformedUsers = res.data.map((user: any) => (
                {
                ...user,
                createdAt: new Date(user.createdAt), // Convert `createdAt` to a Date object
                lastLogin: new Date(user.lastLogin),
                updatedAt: new Date(user.updatedAt),
                activationExpire: new Date(user.activationExpire),
            }));
            setUsers(transformedUsers);       
        })
        .catch(error => {
            console.log(error)
        })

    },[])

    useEffect(()=>{
        api.get(`${rolesURL}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            setRoles(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])

    useEffect(() => {
        if (selectedUser?.userHasRole) {
            const initialRoles = selectedUser.userHasRole.map((userHasRole: UserHasRole) => userHasRole.role);
            setSelectedRoles(initialRoles.filter(Boolean) as Role[]); // Ensure no null values
        }
    }, [selectedUser]);
    
    const translateRoles = (roles:string[]) => {
        let translated = ""
        if (!roles){
            return "Sin roles"
        }
        if (roles.includes("Expert")){
            translated = "Nutricionista"
        }
        else if (roles.includes("Store")){
            translated = "Tienda"
        }
        else if (roles.includes("Tech")){
            translated = "Soporte"
        }
        else if (roles.includes("Admin")){
            translated = "Administrador"
        }
        else if (roles.includes("Core")){
            translated = "Común"
        }
        else{
            translated = "Sin roles"
        }
        return translated
        
    }
    const columns: GridColDef[] = [
        {field: "name", headerName: "Nombre", flex: 1.2, headerClassName: "header-colors", headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 2, headerClassName: "header-colors", headerAlign: "center"},
        {field: "createdAt", headerName: "Creada el", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "date"
        },
        {
            field: "roles",
            headerName: "Tipo",
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center",
            align: "center",
            
            renderCell: (params: GridRenderCellParams) => {
                // Extract roles from userHasRole
                const roles = params.row.userHasRole?.map((userRole: any) => userRole.role?.name).filter(Boolean);
                // Join the roles into a comma-separated string
                return translateRoles(roles) // Handle case where there are no roles
            },
        },
        
        {field: "isActive", headerName: "Estado", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Activada"}, 
                {value: false, label: "Desactivada"}, 
            ],
            renderCell: (params) => {
                const isActive = params.value; // Get the value of isActive (true or false)
                const isPending = params.row.isPending
                return ( 
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        height: '100%',
                    }}>
                    {isPending 
                        ?   <Tooltip title={"Pendiente"} placement="left" arrow>
                                <PendingIcon
                                sx={{ 
                                    color: "primary.main", 
                                }} 
                            />
                            </Tooltip>
                        :  <Tooltip title={isActive ? "Activada" : "Desactivada"} placement="left" arrow>
                                {
                                    isActive
                                        ?   <CheckCircleIcon sx={{color: "secondary.dark"}}/>
                                        :   <DoNotDisturbOnIcon sx={{color: "warning.dark"}}/>
                                            
                                }
                            </Tooltip>
                        }
                    </Box>
                   
                );
            },
        },
        {field: "isPending", headerName: "Pendiente", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Sí"}, 
                {value: false, label: "No"}, 
            ]
        },
        {field: "isSuspended", headerName: "Suspendida", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Sí"}, 
                {value: false, label: "No"}, 
            ]
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center", 
            type: "actions",
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    height: '100%',
                }}>
                    {params.row.isPending ? (
                    <>
                    <Tooltip title="Ver perfil" key="profile" placement="left" arrow>
                        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <Visibility />
                        </IconButton>
                    </Tooltip>
                    {/* Botón Aceptar */}
                    <Tooltip title="Aceptar cuenta" key="accept" placement="top" arrow>
                        <IconButton onClick={()=>{
                            setSelectedUser(params.row)
                            setShowFlipStateDialog(params.row.id)
                            }}
                        >
                            <CheckCircleIcon sx={{color: "secondary.dark"}}/>
                        </IconButton>
                    </Tooltip>

                    {/* Botón Rechazar */}
                    <Tooltip title="Rechazar cuenta" key="reject" placement="right" arrow>
                        <IconButton color="error" onClick={()=>{
                            setSelectedUser(params.row)
                            setShowRejectDialog(true)
                            }}
                        >
                            <BlockIcon />
                        </IconButton>
                    </Tooltip>
                    </>
                ) : (
                    <>
                    {/* Botón Modificar */}
                    <Tooltip title="Ver perfil" key="profile" placement="left" arrow>
                        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <Visibility />
                        </IconButton>
                    </Tooltip>

                    {/* Botón Desactivar */}
                    {   params.row.isActive 
                        ?   <Tooltip title="Desactivar cuenta" key="disable" placement="top" arrow>
                                <IconButton onClick={()=>{
                                    setSelectedUser(params.row)
                                    setShowFlipStateDialog(true)
                                    // handleStateChange(params.row.id, "Inactive")
                                }}>
                                    <DoNotDisturbOnIcon sx={{color: "warning.dark"}}/>
                                </IconButton>
                            </Tooltip>
                        :   <Tooltip title="Reactivar cuenta" key="enable" placement="top" arrow>
                                <IconButton onClick={()=>{
                                    setSelectedUser(params.row)
                                    setShowFlipStateDialog(true)
                                    // handleStateChange(params.row.id, "Active")
                                }}>
                                    <CheckCircleIcon sx={{color: "secondary.dark"}}/>
                                </IconButton>
                            </Tooltip>
                    }
                    
                    <Tooltip title="Eliminar cuenta" key="delete" placement="right" arrow>
                        <IconButton color="error" onClick={() => {
                        setSelectedUser(params.row);
                        setOpenDeleteDialog(true);
                        }}>
                        <DeleteForeverRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    </>
                )}
                    
                </Box>
            )
        }
    ]

    const handleRowClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
      ) => {
        return navigate("/users/" + params.row.id)
      };

      const handleDelete = async (id: string) => {
        
        api.delete(`${usersURL}/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            setUsers(users.filter((user: User) => user.id !== id));
            setSnackbarMsg('Usuario eliminado.');
        })
        .catch (error => {
            setSnackbarMsg('Error al intentar eliminar usuario');
        }) 
        .finally(()=> {
            setShowRejectDialog(false)
            setReason("")
            setOpenDeleteDialog(false);
            setOpenEditDialog(false)
            setSnackbarOpen(true);
        })
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCreateUser = (data: FormValues) => {
        let roles = data.roles
        let newUser = {}
        if (role.includes("Expert")){
            newUser = {
                name: data.name,
                email: data.email,
                pass: data.pass,
                profilePic: "default_profile.png",
                userRole: role,
                address: data.address,
                description: data.description,
                phone: data.phone,
                webPage: data.webPage,
                specialty: data.specialty,
                isNutritionist: data.isNutritionist,
                isCoach: data.isCoach
            }
        }
        else if (role.includes("Store")){
            newUser = {
                name: data.name,
                email: data.email,
                pass: data.pass,
                profilePic: "default_profile.png",
                userRole: role,
                address: data.address,
                description: data.description,
                phone: data.phone,
                webPage: data.webPage,
            }
        }
        else if (role.includes("Tech") || roles.includes("Core")) {
            newUser = {
                name: data.name,
                email: data.email,
                pass: data.pass,
                profilePic: "default_profile.png",
                userRole: role,
            }
        }
        else{
            setSnackbarMsg("Error al crear usuario")   
            setOpenNewUserDialog(false)
            return
        }
        api.post(usersURL, newUser, {withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res)=>{
            if(res.data.name){
                setUsers((prevUsers) => [...prevUsers,
                    {
                        ...res.data, 
                        createdAt: new Date(res.data.createdAt),
                        lastLogin: new Date(res.data.lastLogin),
                        updatedAt: new Date(res.data.updatedAt),
                        activationExpire: new Date(res.data.activationExpire),
                    }
                ]);
                setSnackbarMsg("Usuario creado con éxito")   
                setOpenNewUserDialog(false)
            }                
        })
        .catch(error => {
            setSnackbarMsg("Error al crear usuario")   
            setOpenNewUserDialog(false)
        })
        .finally(()=> {
            setSnackbarOpen(true)
        })
    }

    const handleOpenCreateUser = () => {
        reset()
        setOpenNewUserDialog(true)
        setPage(0)
        setRole(["Core"])
    }

    const handleCloseCreateUser = () => {
        setOpenNewUserDialog(false)
    }

    const handleGoBackCreateUser = () => {
        reset()
        setPage(0)
    }

    const handleStateChange = (id:string, newState: string) => {
        let requestBody = {}
        if (newState==="Active"){
            requestBody = {
                isActive: true,
                isPending: false
            }
        }
        else{
            requestBody = {
                isActive: false,
                isPending: false,
                reason
            }
        }
        api.patch(`${usersURL}/${id}`,
            requestBody, 
            {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        )
        .then((res)=>{     
            const updatedUsers:any = users.map((user:any) => 
                user.id === id ? { 
                    ...user, 
                    isActive: newState==="Active"?true:false, 
                    isPending: false
                    } : user
            );
            setUsers(updatedUsers);
            if (selectedUser?.id === id) {
                setSelectedUser((prevUser:any) => ({
                    ...prevUser,
                    isActive: newState==="Active"?true:false,
                    isPending: false
                }));
            }
        })
        .catch (error => {
            console.log(error)
        })
        .finally(()=>{
            setSnackbarMsg(newState==="Active"?'Cuenta activada correctamente':'Cuenta desactivada correctamente');
            setSnackbarOpen(true)
            setShowFlipStateDialog(false)
            setReason("")
        })
       
    };

    const handleSuspendedChange = (id:string, newState: string) => {
        api.patch(`${usersURL}/${id}`,
            {
                isSuspended:newState==="Suspended"?true:false,
            }, 
            {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        )
        .then((res)=>{     
            const updatedUsers:any = users.map((user:any) => 
                user.id === id ? { 
                    ...user, 
                    isSuspended: newState==="Suspended"?true:false,
                    } : user
            );
            setUsers(updatedUsers);
            if (selectedUser?.id === id) {
                setSelectedUser((prevUser:any) => ({
                    ...prevUser,
                    isSuspended: newState==="Suspended"?true:false,
                }));
            }
            console.log(res.data)
            setSnackbarMsg(newState==="Suspended"?'Cuenta suspendida correctamente':'Cuenta restaurada correctamente');
        })
        .catch (error=>{
            console.log(error)
            setSnackbarMsg(error.response.data.message)
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })
       
    };

    const onRoleUpdate = (updatedUser:User) =>{
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUser.id
                    ? { ...user, userHasRole: updatedUser.userHasRole } // Replace the roles
                    : user
            )
        );
        if (selectedUser?.id === updatedUser.id) {
            setSelectedUser((prevSelectedUser:User) => ({
                ...prevSelectedUser,
                userHasRole: updatedUser.userHasRole,
            }));
        }
    }

    const handleRoleToggle = (role: Role) => {
        setSelectedRoles((prev) =>
            prev.some((r) => r.id === role.id)
                ? prev.filter((r) => r.id !== role.id) // Remove if already selected
                : [...prev, role] // Add if not selected
        );
    };

    const handleRoleSelect = (selectedRole: string[], userTypeName: string) => {
        setUserTypeName(userTypeName)
        setRole(selectedRole);
        setPage(1); // Move to the next page (form)
    };

    const handleChangeRoles = () => {
        // Logic to handle adding roles (e.g., making a request to the backend)
        api.patch(`${usersURL}/${selectedUser.id}/roles`,
            {
                userHasRoles: selectedRoles // Send the selected roles
            }, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        )
        .then(res => {
            console.log(res);
            onRoleUpdate(res.data); // Call the parent or update function with new roles
            setSnackbarMsg("Roles actualizados");
        })
        .catch(error => {
            console.error(error);
            setSnackbarMsg(error.response.data.message);
        })
        .finally(() => {
            setSnackbarOpen(true);
            setShowChangeRolesDialog(false); // Close the dialog after updating roles
        });
    };

    const CustomToolbar: React.FC = () => (
        <GridToolbarContainer
        sx={{
            border: "2px solid",
            borderColor: 'primary.dark', // Change the background color
        }}>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <GridToolbarExport />
            <Tooltip title="Crear usuario" key="create" placement="bottom">
                <Button
                    onClick={handleOpenCreateUser}
                    sx={{fontSize: 13}}
                >
                    <AddIcon/>
                    Crear
                </Button>
            </Tooltip>
            
        </GridToolbarContainer>
    );


      return ( 
        <Grid container 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        sx={{width: "100vw", maxWidth:"1000px", gap:"10px"}}>
            <Box 
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "500px",
                position: 'fixed',
                top: isAppBarVisible?"50px":"0px",
                width:"100%",
                transition: "top 0.3s",
                backgroundColor: 'primary.dark', // Ensure visibility over content
                zIndex: 100,
                boxShadow: 3,
                overflow: "hidden", 
                borderBottom: "5px solid",
                borderLeft: "5px solid",
                borderRight: "5px solid",
                borderColor: "secondary.main",
                boxSizing: "border-box",
                color: "primary.contrastText"
            }}
            >
                <Box sx={{display: "flex", flex: 1}}>
                        <NavigateBack/>
                    </Box>
                    <Box sx={{display: "flex", flex: 4}}>
                        <Typography variant='h5' width="100%"  color="primary.contrastText" sx={{py:1}}>
                            Usuarios
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flex: 1}}>
                    </Box>
                </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width:"90vw",
                maxWidth: "1000px",
                overflow: "auto",
                marginTop: "60px",
                
            }}>
                <DataGrid 
                    rows={users}
                    columns={columns}
                    rowHeight={32}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        sorting: {
                            sortModel: [
                                { field: 'isPending', sort: 'desc' }, // Cambiar 'asc' a 'desc' si quieres orden descendente
                            ],
                        },
                        columns: {
                            columnVisibilityModel: {
                                isSuspended: false, // Oculta la columna "isSuspended"
                                isPending: false
                            },
                        },
                    }}
                    slots={{ toolbar: CustomToolbar }}
                    pageSizeOptions={[5, 10]}
                    filterModel={filterModel}
                    onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText} // Apply locale directly
                    getRowClassName={(params) => {
                        if (params.row.isPending) {
                            return "row-pending";
                        }
                        return params.indexRelativeToCurrentPage % 2 === 0 ? "row-even" : "row-odd";
                    }}
                    sx={{
                        width: "100%", 
                        minWidth: 0,
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'transparent', // Evitar el cambio de color al hacer hover
                        },
                        '& .MuiDataGrid-row.MuiDataGrid-row.pending': {
                            backgroundColor: 'warning.light', // Color personalizado para las filas pendientes
                        },
                        '& .row-pending': {
                            backgroundColor: 'warning.light',
                            fontFamily: "Montserrat"
                        },
                        '& .row-odd:not(.row-pending)': {
                            backgroundColor: 'secondary.light', // Light grey for odd rows
                            fontFamily: "Montserrat"
                        },
                        '& .row-even:not(.row-pending)': {
                            backgroundColor: '#ffffff', // White for even rows
                            fontFamily: "Montserrat"
                        },
                        '& .MuiDataGrid-sortIcon': {
                            color: 'primary.contrastText', // Change sort icon color
                        },
                        '& .MuiDataGrid-menuIconButton': {
                            color: 'primary.contrastText', // Change column menu icon color
                        },
                        '& .header-colors': {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: "bold",
                            fontFamily: "Righteous",
                            whiteSpace: "normal"
                        },
                    }}
                    />
                    
                    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}
                    PaperProps={{
                        sx: {
                            maxHeight: '80vh', 
                            width: "100vw",
                            maxWidth: "450px",
                            margin:0
                        }
                    }} 
                    >
                        <DialogTitle>Borrar usuario</DialogTitle>
                        <DialogContent>
                            ¿Seguro que desea borrar a este usuario?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                                No
                            </Button>
                            <Button onClick={() => handleDelete(selectedUser?.id)} variant="contained" color="primary">
                                Sí
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showFlipStateDialog} onClose={() => {
                        setReason("")
                        setShowFlipStateDialog(false)
                    }}
                    PaperProps={{
                        sx: {
                            maxHeight: '80vh', 
                            width: "100vw",
                            maxWidth: "450px",
                            margin:0
                        }
                    }}
                    >
                        <DialogTitle>{selectedUser?.isActive?<>Desactivar</>:<>Activar</>} cuenta</DialogTitle>
                        <DialogContent>
                            ¿Seguro que desea {selectedUser?.isActive?<>desactivar</>:<>activar</>} esta cuenta?
                            {
                                selectedUser?.isActive
                                && <TextField 
                                value={reason} 
                                label="Motivo"  
                                variant="standard"
                                onChange={(e) => setReason(e.target.value)}
                                multiline
                                rows={2}
                                />
                            }
                            
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setReason("")
                                setShowFlipStateDialog(false)
                            }} color="primary">
                                No
                            </Button>
                            <Button onClick={() => handleStateChange(selectedUser?.id, selectedUser?.isActive?"Inactive":"Active")} 
                            disabled={selectedUser?.isActive && reason===""} variant="contained" color="primary">
                                Sí
                            </Button>
                            
                        </DialogActions>
                    </Dialog>
                    <Dialog open={showRejectDialog} onClose={() => {
                        setShowRejectDialog(false)
                        setReason("")
                    }}
                    PaperProps={{
                        sx: {
                            maxHeight: '80vh', 
                            width: "100vw",
                            maxWidth: "450px",
                            margin:0
                        }
                    }}
                    >
                        <DialogTitle>Rechazar cuenta</DialogTitle>
                        <DialogContent>
                            ¿Seguro que desea rechazar esta solicitud?
                            <TextField 
                            value={reason} 
                            label="Razón de rechazo"  
                            variant="standard"
                            onChange={(e) => setReason(e.target.value)}
                            multiline
                            rows={2}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setReason("")
                                setShowRejectDialog(false)
                            }} color="primary">
                                No
                            </Button>
                            <Button onClick={() => handleDelete(selectedUser?.id)} disabled={reason===""} variant="contained" color="primary">
                                Sí
                            </Button>
                            
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openEditDialog} onClose={handleCloseEditDialog}
                    PaperProps={{
                        sx: {
                            maxHeight: '80vh', 
                            width: "100vw",
                            maxWidth: "600px",
                            margin:0
                        }
                    }} 
                    >
                        <DialogTitle>
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                                Usuario - {selectedUser?.name || ""}
                                <IconButton
                                color="inherit"
                                onClick={handleCloseEditDialog}
                                sx={{p:0}}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <UserAccountEdit selectedUser={selectedUser}/>
                        </DialogContent>
                        
                    </Dialog>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMsg}
                    >
                        <Alert variant="filled" onClose={handleCloseSnackbar} severity={snackbarMsg.includes("Error")?"error":"success"} sx={{ width: '100%' }}>
                            {snackbarMsg}
                        </Alert>
                    </Snackbar>
                    
                    <Dialog open={openNewUserDialog} onClose={handleCloseCreateUser} 
                    scroll="paper"
                    PaperProps={{
                        sx:{width: "100vw", 
                            maxWidth: "500px", 
                            margin: 0}
                    }}
                    >
                        <DialogTitle
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            bgcolor: "primary.contrastText"
                        }}
                        >
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                                {page===1 && <IconButton
                                color="inherit"
                                onClick={handleGoBackCreateUser}
                                sx={{p:0}}
                                >
                                    <ArrowBackIcon/>
                                </IconButton>}
                                Crear usuario {userTypeName}
                                <IconButton
                                color="inherit"
                                onClick={handleCloseCreateUser}
                                sx={{p:0}}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                        </DialogTitle>
                        <form onSubmit={handleSubmit(handleCreateUser)} noValidate encType="multipart/form-data">
                        {page === 0 ? ( // Page 1: Role selection
                            <DialogContent>
                                <Box 
                                sx={{
                                    width: "100%", 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    gap:2
                                }}>
                                    <Typography variant="h6">Tipo de usuario</Typography>
                                    <Button fullWidth variant="contained" onClick={() => handleRoleSelect(['Core'], "Común")}>Común</Button>
                                    <Button fullWidth variant="contained" onClick={() => handleRoleSelect(["Core", 'Expert'], "Nutricionista")}>Nutricionista</Button>
                                    <Button fullWidth variant="contained" onClick={() => handleRoleSelect(["Core", "Store"], "Tienda")}>Tienda</Button>
                                    <Button fullWidth variant="contained" onClick={() => handleRoleSelect(["Core", "Tech"], "Soporte")}>Soporte</Button>
                                </Box>
                            </DialogContent>
                        )
                        : ( // Page 2: Form with user details
                            <>
                                <DialogContent>
                                    <TextField
                                        id="name"
                                        label="Nombre"
                                        type="text"
                                        variant="standard"
                                        inputProps={{
                                            maxLength: 100,
                                            form: {
                                                autocomplete: 'off',
                                            },
                                        }}
                                        fullWidth
                                        sx={{ my: 1 }}
                                        {...register("name", { required: "Ingresar nombre" })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                    <TextField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        variant="standard"
                                        autoComplete="off"
                                        inputProps={{
                                            maxLength: 100,
                                            form: {
                                                autocomplete: 'off',
                                            },
                                        }}
                                        fullWidth
                                        sx={{ my: 1 }}
                                        {...register("email", { required: "Ingresar email" })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                    <TextField
                                        id="pass"
                                        autoComplete="off"
                                        label="Contraseña"
                                        type={showPass ? 'text' : 'password'}
                                        variant="standard"
                                        inputProps={{
                                            maxLength: 100,
                                            form: {
                                                autocomplete: 'off',
                                            },
                                        }}
                                        fullWidth
                                        sx={{ my: 1 }}
                                        {...register("pass", {
                                            required: "Ingresar contraseña",
                                            minLength: { value: 8, message: "Mínimo 8 caractéres" },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                                message: "Contraseña inválida",
                                            },
                                        })}
                                        error={!!errors.pass}
                                        helperText={errors.pass?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => setShowPass(!showPass)}
                                                        aria-label="toggle password visibility"
                                                    >
                                                        {showPass ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {password && (
                                    <List>
                                        {passwordRequirements.map((req, index) => (
                                        <ListItem key={index} disableGutters>
                                            {req.valid ? (
                                            <CheckCircleRoundedIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                                            ) : (
                                            <CancelRoundedIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                                            )}
                                            <ListItemText
                                            primary={
                                                <Typography
                                                variant="subtitle2"
                                                color={req.valid ? "primary.main" : "error.main"}
                                                >
                                                {req.text}
                                                </Typography>
                                            }
                                            />
                                        </ListItem>
                                        ))}
                                    </List>
                                    )}
                                    <TextField
                                        id="confirmPassword"
                                        label="Repetir contraseña"
                                        type={showConfirmPass ? 'text' : 'password'}
                                        variant="standard"
                                        inputProps={{
                                            maxLength: 100,
                                            form: {
                                                autocomplete: 'off',
                                            },
                                        }}
                                        fullWidth
                                        sx={{ my: 1 }}
                                        {...register("confirmPassword", {
                                            required: "Repetir contraseña",
                                            validate: () => watch("pass") !== watch("confirmPassword") ? "Contraseñas no coinciden" : true,
                                        })}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                        aria-label="toggle password visibility"
                                                    >
                                                        {showConfirmPass ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {
                                        (role.includes("Store") || role.includes("Expert")) && <>
                                        <TextField 
                                        sx={{my:1}}
                                        id="address" 
                                        label="Dirección" 
                                        type="text" 
                                        variant="standard" 
                                        fullWidth
                                        {...register("address")}
                                        error={!!errors.address}
                                        helperText = {errors.address?.message}
                                        inputProps={{ maxLength: 100 }}
                                        />

                                        <TextField 
                                        sx={{my:1}}
                                        id="description" 
                                        label="Descripción" 
                                        type="text" 
                                        variant="standard" 
                                        multiline
                                        fullWidth
                                        rows={5} // Default number of rows
                                        maxRows={5} // Maximum number of rows it can expand to
                                        {...register("description", {required: "Ingresar descripción breve"})}
                                        error={!!errors.description}
                                        helperText = {errors.description?.message}
                                        inputProps={{ maxLength: 750 }}
                                        />

                                        <TextField 
                                        sx={{ my: 1 }}
                                        id="phone" 
                                        label="Teléfono" 
                                        type="tel" 
                                        variant="standard" 
                                        fullWidth
                                        inputProps={{
                                            maxLength: 15, // Enforces a maximum input length
                                        }}
                                        {...register("phone", {
                                            pattern: {
                                                value: /^\+56\s?(2|9)\s?\d{4}(\d{4}|\s?\d{4})$/,
                                                message: "Formato incorrecto",
                                            }
                                        })}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message || ""}
                                        />
                                        <FormHelperText>
                                            ej: +56 9 1234 5678
                                        </FormHelperText>

                                        <TextField 
                                            sx={{my:1}}
                                            id="webPage" 
                                            label="Página web" 
                                            type="text" 
                                            variant="standard" 
                                            fullWidth
                                            {...register("webPage")}
                                            error={!!errors.webPage}
                                            helperText = {errors.webPage?.message}
                                            inputProps={{ maxLength: 100 }}
                                        />
                                    </>
                                    }
                                    {
                                        role.includes("Expert") && <>
                                        <TextField 
                                            sx={{my:1}}
                                            id="specialty" 
                                            label="Especialización" 
                                            type="text" 
                                            variant="standard" 
                                            fullWidth
                                            {...register("specialty", {required: "Ingresar especialización"})}
                                            error={!!errors.specialty}
                                            helperText = {errors.specialty?.message}
                                            inputProps={{ maxLength: 100 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={watch("isNutritionist")}
                                                    onChange={(e) => form.setValue("isNutritionist", e.target.checked)}
                                                />
                                            }
                                            label="Nutricionista"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={watch("isCoach")}
                                                    onChange={(e) => form.setValue("isCoach", e.target.checked)}
                                                />
                                            }
                                            label="Coach"
                                        />
                                        </>
                                    }
                                </DialogContent>
                            </>
                        )
                        }
                        <DialogActions>   
                            {page===1 && <> 
                                <Button onClick={handleGoBackCreateUser} color="primary">
                                    Volver
                                </Button>  
                                <Button type="submit" variant="contained" disabled={!isFormValid}> 
                                    Crear cuenta
                                </Button>
                                </>  
                            }
                        </DialogActions>
                        
                        </form>
                    </Dialog>
                    <Dialog
                    open={showChangeRolesDialog}
                    onClose={() => setShowChangeRolesDialog(false)}
                    PaperProps={{ sx: { maxWidth: "500px", width: "95vw", }}}
                >
                    <DialogTitle>Cambiar roles del usuario {selectedUser?.name}</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                                {roles.map((role: Role) => (<div key={role.id}>
                                    <Box  sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                                        <FormControlLabel
                                            key={role.id}
                                            control={ 
                                                <Checkbox 
                                                    checked={selectedRoles.some(p => p.id === role.id)}
                                                    onChange={() => handleRoleToggle(role)}
                                                />
                                            }
                                            label={role.name}
                                        ></FormControlLabel>
                                    </Box>
                                    </div>
                                ))}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowChangeRolesDialog(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleChangeRoles}>Guardar</Button>
                    </DialogActions>
                </Dialog>
                    
            </Box>
        </Grid>
    )

}

export default UserList