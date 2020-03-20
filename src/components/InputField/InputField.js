import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/";
import styles from "./styles";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";


const ENTER_KEY = 13;

class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.input.value,
            disabled: props.disabled,
            meta:props.meta
        };
    }

    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.oneOfType([
            PropTypes.string, PropTypes.number
        ]),
        input: PropTypes.object.isRequired,
        helpText: PropTypes.any,
        meta: PropTypes.object,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        disabled: PropTypes.bool,
        classes: PropTypes.object
    }

    static defaultProps = {
        step: 1
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            disabled: nextProps.disabled,
            meta:nextProps.meta,
            label:nextProps.label
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextState.value !== this.state.value || nextProps.disabled !== this.state.disabled || !(isEqual(nextProps.meta,this.state.meta)) || !(isEqual(nextProps.label,this.state.label)));
    }

    handleKeyDown = e => {
        if (e.keyCode === ENTER_KEY) {
            this.props.input.onChange(this.state.value);
        }
    }

    componentDidMount() {
        this.sendTextChange = debounce(this.sendTextChange, 500);
    }

    sendTextChange = (text) => {
        this.props.input.onChange(text);
    };

    onChange = (event) => {
        if (this.props.min) {
            if (event.target.value < this.props.min)
                return;
        }
        if (this.props.max) {
            if (event.target.value > this.props.max)
                return;
        }
        const value = event.target.value;
        this.setState({
            value: event.target.value
        });
        this.sendTextChange(value);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    render() {
        const {
            label,
            name,
            width,
            input,
            helpText,
            meta: { touched, error },
            classes,
            min,
            max,
            step
        } = this.props;
        const tourid=`react_tour__${input.name}`;
        return (
            <TextField
                tourid={tourid}
                variant="outlined"
                margin="dense"
                label={label}
                name={name}
                style={{ width: width }}
                helperText={(touched && error) || (helpText || " ")}
                error={touched && !!error}
                InputLabelProps={{
                    shrink: true,
                    classes: {
                        root: classes.inputLabel
                    }
                }}
                InputProps={{
                    classes: {
                        root: classes.inputRoot,
                        input: classes.input,
                        multiline: classes.multiline
                    }
                }}
                // eslint-disable-next-line
                inputProps={{
                    min: min,
                    max: max,
                    step: step
                }}
                {...input}
                {...omit(this.props, [
                    "classes",
                    "helpText"
                ])}
                onChange={this.onChange}
                value={this.state.value}
                onKeyDown={this.handleKeyDown}
            />
        );
    }
}

export default withStyles(styles)(InputField);
