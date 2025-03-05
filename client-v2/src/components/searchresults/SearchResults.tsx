import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "../../store/store";
import { searchArticlesAsync } from "../../store/slices/SearchSlice";

import { Card, CardHeader, Text, Spinner, Subtitle2, Caption1, CardFooter, Button, Menu, MenuTrigger, MenuList, MenuItem, MenuPopover } from "@fluentui/react-components";
import { LinkMultipleRegular, MoreHorizontal20Regular, EditRegular, DeleteRegular } from "@fluentui/react-icons";

import Styles from "./SearchResults.style";

const SearchResults = () => {

    const classes = Styles();
    const dispatch: AppDispatch = useDispatch();

    const store = useSelector((state: RootState) => state);

    useEffect(() => {
        dispatch(searchArticlesAsync());
    }, [dispatch]);

    return (
        <div className={classes.root}>
            {store.search.status === 'loading' &&
                <Spinner style={{ marginTop: "10px" }} />
            }
            {store.search.status === 'succeeded' &&
                <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", marginTop: "10px" }}>
                    Your query returned <strong>{store.search.results.length}</strong> results.
                </Subtitle2>
            }
            <div className={classes.results}>
                {store.search.status === 'succeeded' && store.search.results.map((article) => (
                    <Card className={classes.result} key={article.id} title={article.title}>
                        <CardHeader
                            image={<img src={process.env.PUBLIC_URL + "/favicon.png"} alt="logo" className={classes.cardlogo} />}
                            header={<Text weight="semibold">{article.title}</Text>}
                            description={
                                <Caption1 className={classes.cardcaption}>Davide Mauri</Caption1>
                            }
                        />
                        <p className={classes.cardbody}>{article.body}</p>
                        <CardFooter
                            action={
                                <Menu>
                                    <MenuTrigger disableButtonEnhancement>
                                        <Button
                                            appearance="transparent"
                                            icon={<MoreHorizontal20Regular />}
                                            aria-label="More options"
                                        />
                                    </MenuTrigger>
                                    <MenuPopover>
                                        <MenuList>
                                            <MenuItem icon={<EditRegular />}>Edit</MenuItem>
                                            <MenuItem icon={<DeleteRegular />}>Delete</MenuItem>
                                        </MenuList>
                                    </MenuPopover>
                                </Menu>}
                        >
                            <Button icon={<LinkMultipleRegular />}>Open</Button>
                        </CardFooter>
                    </Card>
                ))}
                {store.search.status === 'failed' && <h2>{store.search.error}</h2>}
            </div>
        </div>
    );
};

export default SearchResults;

