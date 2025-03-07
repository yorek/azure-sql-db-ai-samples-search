import { Card, CardHeader, Text, Caption1, CardFooter, Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem, Tag } from "@fluentui/react-components";
import { LinkMultipleRegular, MoreHorizontal20Regular, EditRegular, DeleteRegular, ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";
import Article from "../../types/Article";

import Style from "./SearchResults.style";   
import React from "react";

interface CardProps {
    article: Article;
}

const SearchCard = (props: CardProps) => {

    const { article } = props;
    const classes = Style();

    const [cardHeight, setCardHeight] = React.useState(250);

    const handleOpen = (article: Article) => {
        window?.open(`https://google.com/?${article.id}`, '_blank')?.focus();
    };

    return (
        <Card className={classes.card} key={article.id} title={article.title} style={{height: `${cardHeight}px`}}>
        <CardHeader
            image={<img src={process.env.PUBLIC_URL + "/favicon.png"} alt="logo" className={classes.cardlogo} />}
            header={<Text weight="semibold">{article.title}</Text>}
            description={
                <Caption1 className={classes.cardcaption}>Davide Mauri</Caption1>
            }
        />
        <div className={classes.tags}>
            {article.tags.map((tag, index) => (
                <Tag appearance="brand" key={index}>{tag}</Tag>
            ))}
        </div>
        <p className={cardHeight === 250 ? classes.cardbody : classes.cardbodyExpand}>{article.body}</p>
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
            <Button onClick={() => handleOpen(article)} icon={<LinkMultipleRegular />}>Open</Button>
            {cardHeight === 250 ? <Button onClick={() => setCardHeight(500)} icon={<ArrowDownRegular />}>Read all</Button> : <Button onClick={() => setCardHeight(250)} icon={<ArrowUpRegular />}>Read less</Button>}

        </CardFooter>
    </Card>
    );
};

export default SearchCard;