import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";
import DialogWrapper from "../../components/DialogWrapper/DialogWrapper";
import AdminAuthentication from "../../components/AdminAuthentication/AdminAuthentication";
import FilterForm from "../../components/FilterForm/FilterForm";
import AddUserForm from "../../components/AddUserForm/AddUserForm";
import AddInventoryForm from "../../components/AddInventoryForm/AddInventoryForm";
import DeleteDialogWrapper from "../../components/DeleteDialogWrapper/DeleteDialogWrapper";
import styles from "./styles";

class EntriesManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addEntryModalShowing: false,
            savedEntries: [],
            entryMode: "add",
            showDeleteDialog:false,
            showEditOptions:false,
            columns:this.columns.filter((column,index) => index < 7 ),
            isEditConfirmDialogOpen:false
        };
    }

    columns = [
         {
            name: "Inventory"
        }, {
            name: "Taken"
        }, {
            name: "Consumed"
        }, {
            name: "Returned"
        }, {
            name: <div style={{display:"flex"}}>
                <LocalMallOutlinedIcon color="primary"/>
                {" "}
Bag
            </div>
        }
    ]

   options = {
       filterType: "multiselect",
       responsive: "scroll",
       rowsPerPage: 100,
       selectableRowsHeader: false,
       selectableRows: false,
       rowsPerPageOptions: [
           10, 30, 50, 100
       ],
       fixedHeader: true
   };
    

   componentDidMount() {
       this.props._fetchEntries();
       this.props._fetchUsers();
       this.props._fetchInventories();
       const authenticated = localStorage.getItem("authenticated",true);
       if(authenticated === "true"){
           this.setState({columns:this.columns,showEditOptions:true});
       }
   }
    openAddEntryModal = () => {
        this.props._openAddEntryModal();
    }
    openAddUserModal = () => {
        this.props._openAddUserModal();
    }
    openAddInventoryModal = () => {
        this.props._openAddInventoryModal();
    }
    closeAddEntryModal = () => {
        this.props._closeAddEntryModal();
        this.setState({ entryMode: "add" });
    }
    closeAddUserModal = () => {
        this.props._closeAddUserModal();
    }
    closeAddInventoryrModal = () => {
        this.props._closeAddInventoryModal();
    }
    onDeleteEntry = () => {
        const { selectedEntry } = this.props;
        this.props._deleteEntry({...selectedEntry,entry_mode:"edit"});
    } 
    hideDeleteDialog = () => {
        this.setState({ entryMode: "add",showDeleteDialog:false });
    }

    openEditConfirmDialog = () => {
        this.setState({isEditConfirmDialogOpen:true});
    }
    closeEditConfirmDialog = () => {
        this.setState({isEditConfirmDialogOpen:false,isAuthenticated:false});
    }
    onEditConfirmDialogSubmit = (e)  =>{
        e.preventDefault();
    }

    toggleEditOptions = (value) => {
        let columns = this.columns;
        if(value === "showEdit"){
            this.setState({showEditOptions:true,columns:columns});
        }else if(value === "hideEdit"){
            const filteredColumns = columns.filter((column,index) => index < 7 )
            localStorage.setItem("authenticated",false);
            this.setState({columns:filteredColumns,showEditOptions:false});
        }
    }
    checkAdminPassword = (values) => {
        if(values.adminPassword === this.props.adminPassword){
            localStorage.setItem("authenticated",true);
            this.props._doAuthenticateEdit(true);
            this.toggleEditOptions("showEdit");
            this.closeEditConfirmDialog();
        }else{
            this.props.createNotification("Incorrect credentials","error");
        }
    }
    
    render() {
        const { entries, addEntryModalShowing,addUserModalShowing,addInventoryModalShowing,classes,isAuthenticated } = this.props;
        return (
            <div>
                <div className={classes.AddEntryButton}>
                    <Button color="primary" variant="contained" className={classes.button} onClick={this.openAddEntryModal}>
                        <AddCircleOutlineOutlinedIcon />
                        <span style={{marginRight:5}}></span>
                        <span>
Add Entry
                        </span>
                    </Button>
                    <Button color="primary" variant="contained" className={classes.button} onClick={this.openAddUserModal}>
                        <PersonAddOutlinedIcon /> 
                        {" "}
                        <span style={{marginRight:5}}></span>
                        <span>
Add User
                        </span>
                    </Button>
                    <Button color="primary" variant="contained" className={classes.button} onClick={this.openAddInventoryModal}>
                        Add Inventry
                    </Button>
                    {!this.state.showEditOptions &&
                        <Button color="primary" onClick={() => this.openEditConfirmDialog()}>
                            Show Edit 
                        </Button>
                    }
                    {this.state.showEditOptions &&
                        <Button variant="outlined" className={classes.button} color="secondary" onClick={() => this.toggleEditOptions("hideEdit")}>
                            Hide Edit
                        </Button>
                    }
                </div>
                <FilterForm
                        users={this.props.users}
                        filterEntry={this.props._filterEntry}
                    />
                <div>
                    <MUIDataTable
                        title={"Switch On Services Employee List"}
                        data={entries}
                        columns={this.state.columns || this.columns}
                        options={this.options}
                    />
                </div>
                <DialogWrapper
                    title={"Authenticate"}
                    content={<AdminAuthentication verifyPassword={this.checkAdminPassword}/>}
                    isOpen={this.state.isEditConfirmDialogOpen}
                    onSubmit={this.onEditConfirmDialogSubmit}
                    onClose={this.closeEditConfirmDialog}
                    formName={"admin-password"}
                >

                </DialogWrapper>
                <ModalWrapper
                    title={"Add Entry"}
                    isOpen={addEntryModalShowing}
                    minWidth={720}
                    showBottomToolbar={false}
                    showCloseIcon={true}
                    onClose={this.closeAddEntryModal}
                    showResizeOptions={false}
                >
                    {/* <EntryForm
                        onCancel={this.closeAddEntryModal}
                        addEntry={this.props._addEntry}
                        users={this.props.users}
                        inventories={this.props.inventories}
                        selectedEntry={this.props.selectedEntry}
                        entryMode={this.state.entryMode}
                        updateEntry={this.props._updateEntry}
                    /> */}
                </ModalWrapper>
                <ModalWrapper
                    title={"Add User"}
                    isOpen={addUserModalShowing}
                    minWidth={260}
                    showBottomToolbar={false}
                    showCloseIcon={true}
                    onClose={this.closeAddUserModal}
                    showResizeOptions={false}
                >
                    <AddUserForm
                        onCancel={this.closeAddUserModal}
                        addUser={this.props._addUser}
                    />
                </ModalWrapper>
                <ModalWrapper
                    title={"Add Inventory"}
                    isOpen={addInventoryModalShowing}
                    minWidth={260}
                    showBottomToolbar={false}
                    showCloseIcon={true}
                    onClose={this.closeAddInventoryrModal}
                    showResizeOptions={false}
                >
                    <AddInventoryForm
                        onCancel={this.closeAddInventoryrModal}
                        addInventory={this.props._addInventory}
                    />
                </ModalWrapper>
                <DeleteDialogWrapper
                    itemTobeDeleted={"entry"}
                    // itemName={selectedRowIp}
                    onClose={this.hideDeleteDialog}
                    onSubmit={this.onDeleteEntry}
                    isOpen={this.state.showDeleteDialog}
                />
            </div>
        );
    }
}

export default withStyles(styles)(EntriesManager);
