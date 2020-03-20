import React, { Component } from "react";
// import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import styles  from "./styles";
import { Modal, Divider, Typography } from "@material-ui/core";
import { ReactComponent as CloseIcon } from "../../assets/closeIcon.svg";
import { ReactComponent as MaximizeIcon } from "../../assets/fullscreen.svg";
import { ReactComponent as MinimizeIcon} from "../../assets/fullscreenExit.svg";
import { ReactComponent as FormattedPreview } from "../../assets/filePreview.svg";
import { ReactComponent as RawFile} from "../../assets/rawFile.svg";
// import { isReactClass } from "propValidator";

class ModalWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        };
        this.state = {
            minWidth: window.innerWidth,
            minHeight: window.clientHeight
        };
    }
    //   static propTypes = {
    //       title: PropTypes.string,
    //       onClose: PropTypes.func,
    //       showCloseIcon: PropTypes.bool,
    //       children: PropTypes.node,
    //       bottomToolbar: PropTypes.node,
    //       showBottomToolbar: PropTypes.bool,
    //       fullHeight: PropTypes.bool,
    //       CloseIcon: isReactClass,
    //       minWidth: PropTypes.oneOfType([
    //           PropTypes.number, PropTypes.string
    //       ]),
    //       minHeight: PropTypes.oneOfType([
    //           PropTypes.number, PropTypes.string
    //       ]),
    //       classes: PropTypes.object,
    //       isOpen: PropTypes.bool,
    //       showResizeOptions:PropTypes.bool,
    //       toggleWindowSize:PropTypes.func,
    //       isMaximize:PropTypes.bool,
    //       showDetailViewIcon:PropTypes.bool,
    //       toggleDetailView:PropTypes.func,
    //       isDetailView:PropTypes.bool,
    //       maxWidth:PropTypes.number
    //   };

  static defaultProps = {
      title: "",
      onClose: () => {},
      options: { label: "" },
      showBottomToolbar: true,
      fullHeight: false,
      minHeight: "auto",
      minWidth: "auto",
      showResizeOptions:false,
      showDetailViewIcon: false,
      toggleWindowSize:() => {},
      isMaximize:false,
      CloseIcon:CloseIcon
  };
  closeModal = () => {
      this.props.onClose();
  };
    componentDidMount = () => {
        window.addEventListener("resize", this.setWindowWidth);

    }
  getStyles = () => {
      const { minWidth, minHeight } = this.state;
      if(!this.props.isMaximize){
          return {
              minWidth: this.props.minWidth,
              minHeight: this.props.minHeight,
              maxWidth: this.props.maxWidth || 850
          };
      } else {
          return {
              minWidth,
              minHeight
          };
      }
  }

    setWindowWidth = () => {
        this.setState({ minWidth: window.innerWidth });
    }

    render() {
        const {
            isOpen,
            classes,
            CloseIcon,
            showCloseIcon,
            isMaximize,
            title,
            toggleWindowSize,
            showResizeOptions,
            showDetailViewIcon,
            toggleDetailView,
            isDetailView
        } = this.props;
        
        const tourId = `react_tour__${title}`.replace(/\s/g,"");

        return (
            <Modal
                open={isOpen}
                onClose={this.closeModal}
                classes={{ root: classes.root }}
                closeAfterTransition={true}
                disableBackdropClick={true}
                disableAutoFocus={true}
                style={{display:"flex",alignItems:"center",justifyContent:"center"}}
            >
                <div tourid = {tourId} className={classNames(classes.modalBodyWrap, {
                    [classes.modalBodyWrapFullHeight]: this.props.fullHeight || isMaximize
                })} style={this.getStyles()}
                >
                    <div className={classes.modalBodyTitleWrap}>
                        <Typography variant="h6" className={classes.modalBodyTitle} >
                            {this.props.title}
                        </Typography>
                        {showDetailViewIcon &&
                            <div className={classes.detailPreviewWrapper}>
                                {isDetailView ?
                                    <div onClick={() => toggleDetailView(false)} className={classes.detailIcon}>
                                        <Tooltip title={"Toggle to raw View"}>
                                            <RawFile style={{ width: 25, height: 25 }} />
                                        </Tooltip>
                                    </div>
                                    :
                                    <div onClick={() => toggleDetailView(true)} className={classes.detailIcon}>
                                        <Tooltip title={"Toggle to formatted View"}>
                                            <FormattedPreview style={{ width: 25, height: 25 }} />
                                        </Tooltip>
                                    </div>}
                            </div>
                        }
                        {showResizeOptions &&
                        <>
                            {isMaximize ? 
                                <div onClick={() => toggleWindowSize(false)} className={classes.modalResize} >
                                    <MinimizeIcon />
                                </div>
                                :
                                <div onClick={() => toggleWindowSize(true)} className={classes.modalResize} >
                                    <MaximizeIcon />
                                </div>}
                        </>
                        }
                        {showCloseIcon &&
                        <div onClick={this.closeModal} className={classes.modalClose} >
                            <CloseIcon />
                        </div>
                        }

                    </div>
                    <div className={classes.modalBodyChildWrap}>
                        {this.props.children}
                    </div>
                    {this.props.showBottomToolbar && 
                    <>
                        <Divider />
                        <div className={classes.modalBodyBottomToolbar}>
                            {this.props.bottomToolbar}
                        </div>
                    </>
                    }
                </div>
            </Modal>
        );
    }
}

export default withStyles(styles)(ModalWrapper);
