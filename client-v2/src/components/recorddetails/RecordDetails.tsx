import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-dialog";
import Style from "./RecordDetails.style";
import { Link, Spinner, Subtitle2 } from "@fluentui/react-components";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect } from "react";
import { getSampleDetailsAsync } from "../../store/slices/SearchSlice";
import TagsGenerator from "./TagsGenerator";

interface RecordDetailsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number;
}

const RecordDetails = (props: RecordDetailsProps) => {

    const classes = Style();
    const { open, setOpen, id } = props;
    const search = useSelector((state: RootState) => state.search);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (open) {
            dispatch(getSampleDetailsAsync(id.toString()));
            // console.log(`RecordDetails useEffect ${id}`);
        }
    }
        , [open, id, dispatch]);

    if (!open) return null;

    return (
        <Dialog modalType="modal" open={open} onOpenChange={(event, data) => {
            if (data.open === false) {
                setOpen(false);
            }
        }}>
            <DialogSurface className={classes.dialog}>
                <DialogBody>
                    <DialogTitle>{search.sampleDetails.sample?.name ?? 'Loading sample ...'}</DialogTitle>
                    <DialogContent>
                        {(search.sampleDetails.status === 'loading') &&
                            <>
                                <Spinner style={{ margin: "30px 0 10px" }} />
                            </>
                        }
                        {/* 
                            Search results stats.
                        */}
                        {search.sampleDetails.status === 'failed' &&
                            <Subtitle2 style={{ fontWeight: "normal", textAlign: "center", margin: "10px 0" }}>
                                An error occurred: <strong>{search.sampleDetails.error}</strong>.<br />
                                Please try again.
                            </Subtitle2>
                        }
                        {/* 
                            Display.
                        */}
                        {search.sampleDetails.status === 'succeeded' &&
                            <div className={classes.details}>
                                <div className={classes.left}>
                                    <Link className={classes.link} href={
                                        search.sampleDetails.sample?.url ?? '#'
                                    } target="_blank">
                                        {search.sampleDetails.sample?.url ?? 'No URL available.'}</Link>
                                    <p className={classes.description}>
                                        <strong>Description:</strong><br />{search.sampleDetails.sample?.description}
                                    </p>
                                    <p className={classes.notes}>
                                        <strong>Notes:</strong><br />{search.sampleDetails.sample?.notes ?? 'No notes available.'}
                                    </p>
                                </div>
                                <div className={classes.right}>
                                    {window.innerWidth > 640 && 
                                    <TagsGenerator sample={search.sampleDetails.sample} />
                        }
                                </div>
                            </div>
                        }

                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default RecordDetails;