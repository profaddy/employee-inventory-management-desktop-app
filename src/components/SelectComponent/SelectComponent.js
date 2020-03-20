import React, { Component } from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import styles from "./styles";
import { withStyles } from "@material-ui/core";
import omit from "lodash/omit";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";

class SelectComponent extends Component {
    static propTypes = {
        classes: PropTypes.object,
        input: PropTypes.object,
        labelname: PropTypes.string,
        labelwidth: PropTypes.number,
        options: PropTypes.array,
        labelfor: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        helperText: PropTypes.oneOfType([
            PropTypes.string, PropTypes.node
        ]),
        valueField: PropTypes.string,
        displayField: PropTypes.string,
        itemRenderer: PropTypes.func,
        meta:PropTypes.object
    }

    static defaultProps = {
        classes: {},
        input: {
            value: "",
            name: "sample",
            onChange: () => {}
        },
        options: [],
        labelfor: "labelFor",
        valueField: "value",
        displayField: "name"
    }

    itemRenderer = (option) => {
        if (this.props.itemRenderer) {
            return this.props.itemRenderer(option);
        } else {
            return (
                <>
                    {option[this.props.displayField]}
                </>
            );
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            value: props.input.value || "",
            disabled: props.disabled
        };
    }

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.props.input.onChange(event.target.value);
    }

    render() {
        const { classes, disabled, valueField, meta } = this.props;
        const tourid = `react_tour__${this.props.input.name}`;
        return (
            <FormControl {...omit(this.props, [
                "classes", "helperText", "valueField", "displayField", "dataResponse", "itemRenderer"
            ])} variant="outlined"
            >
                <InputLabel htmlFor={this.props.labelfor} classes={{root: classes.root}}>
                    {this.props.labelname}
                </InputLabel>
                <Select
                    tourid={tourid}
                    value={this.state.value}
                    onChange={this.handleChange}
                    disabled={disabled}
                    input={
                        <OutlinedInput
                            labelWidth={this.props.labelwidth} 
                            name={this.props.input.name} 
                            id={this.props.labelfor}
                            error={meta && meta.touched && !!meta.error}
                        />
                    }
                >
                    {this.props.options.map((option, key) => (
                        <MenuItem value={option[valueField]} key={key}>
                            {this.itemRenderer(option)}
                        </MenuItem>
                    ))}
                </Select>
                {this.props.helperText &&
                    <FormHelperText classes={{root: classes.formHelperRoot}}>
                        {this.props.helperText}
                    </FormHelperText>
                }
            </FormControl>
        );
    }
}

export default withStyles(styles)(SelectComponent);
