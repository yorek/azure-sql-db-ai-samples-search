import { Card, CardHeader, Text, Caption1, CardFooter, Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import { LinkMultipleRegular, MoreHorizontal20Regular, EditRegular, DeleteRegular, ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";
import LightSample from "../../types/LightSample";

import Style from "./LightSampleCard.style";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CardProps {
    sample: LightSample;
}

const LightSampleCard = (props: CardProps) => {

    const { sample } = props;
    const classes = Style();

    const user = useSelector((state: RootState) => state.user);
    const [cardHeight, setCardHeight] = React.useState(210);

    const handleOpen = (sample: LightSample) => {
        window?.open(sample.url, '_blank')?.focus();
    };

        return (
            <Card className={classes.card} key={sample.id} title={sample.name} style={{ height: `${cardHeight}px` }}>
                <CardHeader
                    image={<img src={process.env.PUBLIC_URL + "/favicon.png"} alt="logo" className={classes.cardlogo} />}
                    header={<Text weight="semibold">{sample.name}</Text>}
                    description={
                        <Caption1 className={classes.cardcaption}><strong>URL:&nbsp;</strong>{sample.url}</Caption1>
                    }
                />
                <div className={cardHeight === 210 ? classes.cardbody : classes.cardbodyExpand}>
                    <p>{sample.description}</p>
                    <p><em>{sample.sample_summary}</em></p>
                </div>
                <CardFooter
                    action={
                        <Menu>
                            <MenuTrigger disableButtonEnhancement>
                                <Button
                                    disabled={!user.isAuth}
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
                    <Button 
                        onClick={() => handleOpen(sample)} 
                        appearance="primary"
                        icon={<LinkMultipleRegular />}>Open</Button>
                    {cardHeight === 210 ? 
                        <Button 
                        appearance="transparent"
                        onClick={() => setCardHeight(350)} 
                        icon={<ArrowDownRegular />}>Read all</Button> 
                        : <Button 
                        appearance="transparent"
                        onClick={() => setCardHeight(210)} 
                        icon={<ArrowUpRegular />}>Read less</Button>
                    }
    
                </CardFooter>
            </Card>
        );
};

export default LightSampleCard;