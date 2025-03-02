import { 
    Avatar, 
    Body1, 
    Body1Strong, 
    Button, 
    Popover, 
    PopoverSurface, 
    PopoverTrigger, 
    Switch,
    makeStyles 
} from "@fluentui/react-components";

const useStyles = makeStyles({
    avatar: {
        cursor: "pointer", 
        display: "flex", 
        flexWrap: "nowrap", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    menu: {
        width: "240px", 
        display: "flex", 
        flexWrap: "nowrap", 
        alignItems: "center", 
        justifyContent: "space-between",
        gap: "12px"
    },
    menuOpen: {
        padding: "8px",
        display: "flex",
        justifyContent: "space-between",
        gap: "12px"
    }
});

const UserWidget = () => {

    const classes = useStyles();

    return (
            <Popover trapFocus withArrow>
                <PopoverTrigger>
                    <div className={classes.avatar}>
                        <Body1Strong style={{ marginRight: "8px"}}>Microsoft</Body1Strong>
                        <Avatar name="Raffaele Garofalo" badge={{ status: "available" }} />
                    </div>
                </PopoverTrigger>
                <PopoverSurface>
                    <div className={classes.menu}>
                        <Body1Strong>Microsoft</Body1Strong>
                        <Button appearance="subtle" size="small">Sign out</Button>
                    </div>
                    <div className={classes.menuOpen}>
                        <Avatar name="Raffaele Garofalo" badge={{ status: "available" }} size={48} />
                        <div style={{ display: "flex", flexDirection:"column"}}>
                            <Body1Strong>Raffaele Garofalo</Body1Strong>
                            <Body1>rgarofalo@microsoft.com</Body1>
                        </div>
                    </div>
                </PopoverSurface>
            </Popover>
    );
};

export default UserWidget;