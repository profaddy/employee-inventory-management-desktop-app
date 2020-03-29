import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: { main: "#2288d2" }
    },
    drawerWidth: 240,
    primaryColor: "#0088D2",
    backgroundColor: "#ffffff",

    lightGray: "#888888",
    lightGreen: "#70D971",
    lightRed: "#ff0000",
    dullGray: "#cccccc",
    bunker: "#22272e",
    Pomegranate:"#f44336",
    EggBlue:"#00BCD4",
    orangePeel:"#ff9800",
    mojo:"#c43f35",
    cityLights:"#b2bec3",
    moderateRed:"#BB352F",

    appBar: {
        backgroundColor: "#5C5C5C",
        textColor: "#ffffff"
    },
    overrides: {
        MUIDataTable: {
            responsiveScroll: {
                maxHeight: window.innerHeight
            }
        }
    },
    card: {
        minWidth: 270,
        separatorColor: "#F2F2F2"
    },
    toggleButton: {
        borderColor: "rgba(0, 0, 0, 0.23)",
        selectedBackgroundColor: "#0088d1",
        defaultForegroundColor: "#444444",
        selectedForegroundColor: "#ffffff"
    },
    fileUploader: {
        borderColor: "#dddddd",
        containerBackgroundColor: "#f5f5f5",
        backgroundColor: "#ffffff"
    },
    overlay: {
        step: {
            width: 280,
            backgroundColor: "#f5f5f5"
        },
        content: {
            backgroundColor: "#ffffff"
        }
    },
    Slider: {
        dotStyle: {
            borderColor: "#cccccc",
            background: "#cccccc"
        },
        activeDotStyle: {
            borderColor: "#0088d1",
            background: "#0088d1"
        },
        handleStyle: {
            display:"none"
        }
    },
    overrides: {
        MUIDataTable: {
            responsiveScroll: {
                maxHeight:`${window.innerHeight - 175}px !important`
            }
        },
        MuiButton: {
            root: {
                textTransform: "none"
            },
            contained: {
                boxShadow: "none"
            },
            label: {
                textTransform: "none",
                fontFamily: "Roboto",
                fontSize: 14,
                fontWeight: 500
            }
        }, 
        MuiBadge: {
            badge: {
                background: "#666666",
                color: "white",
                fontSize: 9
            }
        },
        MuiFormHelperText: {
            root: {
                paddingBottom: 8
            },
            contained: {
                margin: "2px 0px 2px 0px"
            }
        },
        MuiSelect: {
            select: {
                padding: "10px 12px 11px !important", //Don't know why but in production build only this override is required
                fontWeight: "lighter"
            }
        },
        MuiList: {
            padding: {
                paddingTop: 0,
                paddingBottom: 0
            }
        },
        MuiInputLabel: {
            outlined: {
                transform: "translate(14px, 14px) scale(1)"
            }
        }

    }

    // shadow: {
    //     shadow1: "0px 4px 12px rgba(0,0,0, 0.4)",
    //     shadow2: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)"
    // }
});

export default theme;
