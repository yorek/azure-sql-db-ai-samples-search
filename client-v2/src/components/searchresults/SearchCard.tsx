import { Card, CardHeader, Text, CardFooter, Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import { LinkMultipleRegular, MoreHorizontal20Regular, EditRegular, DeleteRegular, Glasses16Regular } from "@fluentui/react-icons";

import Style from "./SearchCard.style";
import React from "react";
import Sample from "../../types/Sample";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import DeleteSample from "../messages/DeleteSample";
import RecordDetails from "../recorddetails/RecordDetails";

interface CardProps {
    sample: Sample;
}

const SearchCard = (props: CardProps) => {

    const { sample } = props;
    const classes = Style();

    const user = useSelector((state: RootState) => state.user);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDetails, setOpenDetails] = React.useState(false);

    const handleOpen = (sample: Sample) => {
        window?.open(sample.url, '_blank')?.focus();
    };

    const handleDelete = () => {
        setOpenDialog(true);
    };

    //console.log(sample);

    return (
        <>
        <Card className={classes.card} key={sample.id} title={sample.name}>
            <CardHeader
                image={<img src={process.env.PUBLIC_URL + "/favicon.png"} alt="logo" className={classes.cardlogo} />}
                header={<Text weight="semibold">{sample.name}</Text>}                
            />
            <div className={classes.cardbodyExpand}>
                <p>{sample.sample_summary}</p>
                <p><em>{sample.notes}</em></p>
                <p><em>{sample.thoughts}</em></p>
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
                                <MenuItem disabled={!user.canEdit} icon={<EditRegular />}>Edit</MenuItem>
                                <MenuItem 
                                    disabled={!user.canDelete} 
                                    icon={<DeleteRegular />}
                                    onClick={() => handleDelete()}>Delete</MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>}
            >
                <Button
                    onClick={() => handleOpen(sample)}
                    appearance="primary"
                    icon={<LinkMultipleRegular />}>Open</Button>
                 <Button
                    appearance="secondary"
                    onClick={() => setOpenDetails(true)}
                    icon={<Glasses16Regular />}>Details</Button>
            </CardFooter>
        </Card>
        <DeleteSample sample={sample} open={openDialog} setOpen={setOpenDialog} />
        <RecordDetails open={openDetails} setOpen={setOpenDetails} id={sample.id} />
        </>
    );
};

export default SearchCard;