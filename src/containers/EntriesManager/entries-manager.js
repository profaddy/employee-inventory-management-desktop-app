import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
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
            showDeleteDialog:false
        };
    }
    componentDidMount() {
        this.props._fetchEntries();
        this.props._fetchUsers();
        this.props._fetchInventories();
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
        this.props._deleteEntry(this.state.deleteItemId);
        this.setState({ entryMode: "add",showDeleteDialog:false });
    } 
    hideDeleteDialog = () => {
        this.setState({ entryMode: "add",showDeleteDialog:false });
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
                            this.props._fetchEntryInfo(value);
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
                            // this.props._fetchEntryInfo(value);
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

    render() {
        console.log(this.props,"props");
        const { entries, addEntryModalShowing,addUserModalShowing,addInventoryModalShowing,classes } = this.props;
        return (
            <div>
                <div className={classes.AddEntryButton}>
                    <Button color="primary" onClick={this.openAddEntryModal}>
                        Add Entry
                    </Button>
                    <Button color="primary" onClick={this.openAddUserModal}>
                        Add User
                    </Button>
                    <Button color="primary" onClick={this.openAddInventoryModal}>
                        Add Inventry
                    </Button>
                </div>
                <MUIDataTable
                    title={"Switch On Services Employee List"}
                    data={entries}
                    columns={this.columns}
                    options={options}
                />
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
                        itemTobeDeleted={"host"}
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
