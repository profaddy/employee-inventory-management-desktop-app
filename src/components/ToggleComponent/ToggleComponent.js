import React, { Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import styles from "./styles";

class ToggleComponent extends Component {
    static propTypes = {
        input: PropTypes.object,
        options: PropTypes.array,
        label: PropTypes.string,
        transform: PropTypes.string,
        classes: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        input: {
            value: "",
            onChange: () => {}
        },
        options: [],
        label: ""
    }

    constructor(props) {
        super(props);
        this.state = {
            selected: this.getValue(props.input.value, props.transform)
        };
    }

    handleToggleChange = (event, value) => {
        if (value !== null) {
            this.setState({
                ...this.state,
                selected: value
            });
            this.props.input.onChange(this.getTransformedValue(value));
        }
    };

    getTransformedValue = (value) => {
        const { transform } = this.props;
        if (transform) {
            switch (transform) {
            case "string":
                value = String(value);
                break;
            case "boolean":
                value = Boolean(value);
                break;
            default:
                value = Boolean(value);
            }
        }

        return value;
    }

    getValue = (value, transform) => {
        let finalValue = value;
        if (transform) {
            switch (transform) {
            case "string":
                finalValue = Boolean(value);
                break;
            case "boolean":
                finalValue = Boolean(value);
                break;
            default:
                finalValue = Boolean(value);
            }
        }

        return finalValue;
    }

    render() {
        const { classes, label, width, height, disabled } = this.props;
        return (
            <>
                {label &&
                    <div className={classes.label}>
                        {label}
                    </div>
                }
                <div className={classes.toggleButtonWrap}>
                    <ToggleButtonGroup
                        id="omnisci.installation.type"
                        value={this.state.selected}
                        exclusive
                        onChange={this.handleToggleChange}
                        classes={{
                            root: classes.toggleButtonGroupRoot
                        }}>
                        {this.props.options.map((option, key) => (
                            <ToggleButton
                                tourid = {`react_tour__${option.value}`}
                                style={{ width: width, height:height }}
                                key={key}
                                value={option.value}
                                disabled={disabled}
                                classes={{
                                    root: classes.toggleButton,
                                    selected: classes.toggleButtonGroupSelected
                                }}>
                                {option.contentRenderer || option.name}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(ToggleComponent);
