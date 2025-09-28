import { Card, CardHeader, Text, CardFooter, Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import { LinkMultipleRegular, MoreHorizontal20Regular, EditRegular, DeleteRegular, Glasses16Regular } from "@fluentui/react-icons";

import Style from "./SearchCard.style";
import React from "react";
import Sample from "../../types/Sample";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import DeleteSample from "../messages/DeleteSample";
import RecordDetails from "../recorddetails/RecordDetails";
import CreateSample from "../messages/CreateSample";

interface CardProps {
    sample: Sample;
}

const SearchCard = (props: CardProps) => {

    const { sample } = props;
    const classes = Style();

    const user = useSelector((state: RootState) => state.user);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [openDetails, setOpenDetails] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const handleOpen = (sample: Sample) => {
        window?.open(sample.url, '_blank')?.focus();
    };

    const handleDelete = () => {
        setOpenDelete(true);
    };
    
    const handleEdit = () => {
        setOpenEdit(true);
    };
    //console.log(sample);

    return (
        <>
        <Card className={classes.card} key={sample.id} title={sample.name}>
            <CardHeader
                image={<img src="/favicon.png" alt="logo" className={classes.cardlogo} />}
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
                                <MenuItem 
                                    disabled={!user.isAdmin} 
                                    icon={<EditRegular />} 
                                    onClick={() => handleEdit()}>Edit</MenuItem>
                                <MenuItem 
                                    disabled={!user.isAdmin} 
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
        <DeleteSample sample={sample} open={openDelete} setOpen={setOpenDelete} />
        <RecordDetails open={openDetails} setOpen={setOpenDetails} id={sample.id} />
        <CreateSample open={openEdit} setOpen={setOpenEdit} editSample={sample} isEditMode={true} />
        </>
    );
};

export default SearchCard;