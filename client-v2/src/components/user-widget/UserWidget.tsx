import {
    Avatar,
    Body1,
    Body1Strong,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    ToggleButton,
} from "@fluentui/react-components";

import {
    WeatherMoonFilled,
    WeatherSunnyRegular,
    ArrowEnterRegular,
    ArrowExitRegular,
    AddRegular
} from "@fluentui/react-icons"

// redux
import { useSelector, useDispatch } from "react-redux";
import { setTheme, getUserAsync } from "../../store/slices/UserSlice";
import { RootState, AppDispatch } from "../../store/store";

import Styles from "./UserWidget.styles";
import { useEffect, useState } from "react";
import CreateSample from "../messages/CreateSample";

const UserWidget = () => {

    const classes = Styles();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        dispatch(getUserAsync());
    }
        , [dispatch]);

    const onLogin = (provider: "aad" | "github") => {
        const url = `/.auth/login/${provider}?post_login_redirect_uri=${window.location.origin}`;
        window.location.href = url;
    };

    const onLogout = () => {
        const url = `/.auth/logout`;
        window.location.href = url;
    };

    // const onCreate = () => {
    //     setCreateOpen(true);
    // };

    return (
        <>
            {user.isAuth ? (
                <div className={classes.authBox}>
                    {/* -- For now we are not using create button --                     
                    <Button
                        icon={<AddRegular />}
                        appearance="primary"
                        size="medium"
                        shape="circular"
                        onClick={onCreate}
                    >Create</Button> */}
                    <Popover trapFocus withArrow>
                        <PopoverTrigger>
                            <div className={classes.avatar}>
                                {/* <Body1Strong style={{ marginRight: "8px" }}>{user.provider.toUpperCase()}</Body1Strong> */}
                                <Avatar
                                    name={user.email}
                                    image={{
                                        src: `https://www.gravatar.com/avatar/${user.emailHash}?d=identicon`
                                    }}
                                    badge={{ status: "available" }} />
                            </div>
                        </PopoverTrigger>
                        <PopoverSurface>
                            <div className={classes.menu}>
                                <Body1Strong>{user.provider.toUpperCase() === "AAD" ? "Microsoft" : "GitHub"}</Body1Strong>
                                <Button
                                    icon={<ArrowExitRegular />}
                                    appearance="transparent"
                                    size="medium" onClick={() => onLogout()}>Sign out</Button>
                            </div>
                            <div className={classes.menuOpen}>
                                <Avatar
                                    image={{
                                        src: `https://www.gravatar.com/avatar/${user.emailHash}?d=identicon`
                                    }}
                                    name={user.email}
                                    badge={{ status: "available" }} size={48} />
                                <div className={classes.menuOpenHeader}>
                                    <Body1Strong>{user.email}</Body1Strong>
                                    <Body1>{user.roles.join(", ").toUpperCase()}</Body1>
                                </div>
                            </div>
                        </PopoverSurface>
                    </Popover>
                    <ToggleButton
                        appearance="transparent"
                        icon={user.theme === "light" ? <WeatherSunnyRegular /> : <WeatherMoonFilled />}
                        onClick={() => dispatch(setTheme(user.theme === "dark" ? 'light' : 'dark'))} />
                    <CreateSample open={createOpen} setOpen={setCreateOpen} />
                </div>
            ) : (
                <div className={classes.authBox}>
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <MenuButton icon={<ArrowEnterRegular />} appearance="primary" shape="circular">
                                Login
                            </MenuButton>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                <MenuItem onClick={() => onLogin("github")}>GitHub</MenuItem>
                                <MenuItem onClick={() => onLogin("aad")}>Microsoft</MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
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