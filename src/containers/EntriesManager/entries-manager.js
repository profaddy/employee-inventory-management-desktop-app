import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import DialogWrapper from "../../components/DialogWrapper/DialogWrapper";
import AdminAuthentication from "../../components/AdminAuthentication/AdminAuthentication"
import EntryForm from "../../components/EntryForm/EntryForm";
import AddUserForm from "../../components/AddUserForm/AddUserForm";
import AddInventoryForm from "../../components/AddInventoryForm/AddInventoryForm";
import DeleteDialogWrapper from "../../components/DeleteDialogWrapper/DeleteDialogWrapper"
import { options } from "./helpers";
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
            columns:this.columns.filter((column) => column.name !== "Actions"),
            isEditConfirmDialogOpen:false,
            isAuthenticated:false,
            password:"admin"
        };
    }

    columns = [
        {
            name: "created_at"
        }, {
            name: "Inventory"
        }, {
            name: "Username"
        }, {
            name: "Taken"
        }, {
            name: "Consumed"
        }, {
            name: "Returned"
        }, {
            name: "Remaining"
        }, {
            name: "Actions",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button onClick={() => {
                            this.props._fetchEntryInfo(value,"edit");
                            this.setState({ entryMode: "edit" });
                        }}>
                            {" "}
                            <EditIcon color="primary" />
                        </Button>
                    );
                }
            }
        },{
            name: "Actions",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button onClick={() => {
                            this.props._fetchEntryInfo(value,"delete");
                            this.setState({ entryMode: "delete",deleteItemId:value,showDeleteDialog:true });
                        }}>
                            {" "}
                            <DeleteIcon color="primary" />
                        </Button>
                    );
                }
            }
        }
    ]

    componentDidMount() {
        // const filteredColumns = this.columns.fliter((column) => column.name === "Actions")
        console.log("test")
        this.props._fetchEntries();
        this.props._fetchUsers();
        this.props._fetchInventories();
        const authenticated = localStorage.getItem("authenticated",true);
        console.log(authenticated,"dehe")
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
        this.props._openAddInventoryModal()
    }
    closeAddEntryModal = () => {
        this.props._closeAddEntryModal();
        this.setState({ entryMode: "add" });
    }
    closeAddUserModal = () => {
        this.props._closeAddUserModal()
    }
    closeAddInventoryrModal = () => {
        this.props._closeAddInventoryModal();
    }
    onDeleteEntry = () => {
        const { selectedEntry } = this.props;
        console.log(selectedEntry,"selectedEntry");
        // const created_at = moment(selectedEntry.cea).format("DD-MM-YYYY")
        this.props._deleteEntry({...selectedEntry,entry_mode:"edit"});
        // this.props._deleteEntry(this.state.deleteItemId);
        // this.setState({ entryMode: "add",showDeleteDialog:false });
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
            const filteredColumns = columns.filter((options) => options.name !== "Actions");
            localStorage.setItem("authenticated",false)
            this.setState({columns:filteredColumns,showEditOptions:false});
        }
    }
    checkAdminPassword = (values) => {
        if(values.adminPassword === this.props.adminPassword){
            localStorage.setItem("authenticated",true)
            this.props._doAuthenticateEdit(true);
            this.toggleEditOptions("showEdit");
            this.closeEditConfirmDialog();
        }else{
            this.props.createNotification("Incorrect credentials","error")
            // this.closeEditConfirmDialog();
        }
    }
    
    render() {
        const { entries, addEntryModalShowing,addUserModalShowing,addInventoryModalShowing,classes,isAuthenticated } = this.props;
        return (
            <div>
                <div className={classes.AddEntryButton}>
                    <Button color="primary" variant="contained" className={classes.button} onClick={this.openAddEntryModal}>
                        Add Entry
                    </Button>
                    <Button color="primary" variant="contained" className={classes.button} onClick={this.openAddUserModal}>
                        Add User
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
                        <Button color="primary" onClick={() => this.toggleEditOptions("hideEdit")}>
                            Hide Edit
                        </Button>
                    }
                </div>
                <MUIDataTable
                    title={"Switch On Services Employee List"}
                    data={entries}
                    columns={this.state.columns || this.columns}
                    options={options}
                />
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
                    <EntryForm
                        onCancel={this.closeAddEntryModal}
                        addEntry={this.props._addEntry}
                        users={this.props.users}
                        inventories={this.props.inventories}
                        selectedEntry={this.props.selectedEntry}
                        entryMode={this.state.entryMode}
                        updateEntry={this.props._updateEntry}
                    />
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
