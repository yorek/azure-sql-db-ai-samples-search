import {
    Avatar,
    Body1,
    Body1Strong,
    Button,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    ToggleButton,
} from "@fluentui/react-components";

import {
    WeatherMoonFilled,
    WeatherSunnyRegular,
    ArrowEnterRegular,
    ArrowExitRegular
} from "@fluentui/react-icons"

// redux
import { useSelector, useDispatch } from "react-redux";
import { login, logout, setTheme } from "../../store/slices/UserSlice";
import { RootState } from "../../store/store";

import Styles from "./UserWidget.styles";

const UserWidget = () => {

    const classes = Styles();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            {user.isAuth ? (
                <div style={{ display: "flex", gap: "16px" }}>
                    <Popover trapFocus withArrow>
                        <PopoverTrigger>
                            <div className={classes.avatar}>
                                <Body1Strong style={{ marginRight: "8px" }}>{user.role}</Body1Strong>
                                <Avatar 
                                    name={user.fullName} 
                                    image={{
                                        src: `https://www.gravatar.com/avatar/${user.emailHash}?d=identicon`
                                    }}
                                    badge={{ status: "available" }} />
                            </div>
                        </PopoverTrigger>
                        <PopoverSurface>
                            <div className={classes.menu}>
                                <Body1Strong>{user.role}</Body1Strong>
                                <Button 
                                icon={<ArrowExitRegular />}
                                appearance="transparent" 
                                size="medium" onClick={() => dispatch(logout())}>Sign out</Button>
                            </div>
                            <div className={classes.menuOpen}>
                                <Avatar 
                                    image={{
                                        src: `https://www.gravatar.com/avatar/${user.emailHash}?d=identicon`
                                    }}                                    
                                    name={user.fullName} 
                                    badge={{ status: "available" }} size={48} />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Body1Strong>{user.fullName}</Body1Strong>
                                    <Body1>{user.email}</Body1>
                                </div>
                            </div>
                        </PopoverSurface>
                    </Popover>
                    <ToggleButton
                        appearance="transparent"
                        icon={user.theme === "light" ? <WeatherSunnyRegular /> : <WeatherMoonFilled />}
                        onClick={() => dispatch(setTheme(user.theme === "dark" ? 'light' : 'dark'))} />
                </div>
            ) : (
                <div style={{ display: "flex", gap: "16px" }}>
                    <Button
                        appearance="primary"
                        size="medium"
                        icon={<ArrowEnterRegular />}
                        onClick={() => dispatch(login())}>Sign in</Button>
                    <ToggleButton
                        appearance="transparent"
                        icon={user.theme === "light" ? <WeatherSunnyRegular /> : <WeatherMoonFilled />}
                        onClick={() => dispatch(setTheme(user.theme === "dark" ? 'light' : 'dark'))} />

                </div>
            )}
        </>
    );
};

export default UserWidget;