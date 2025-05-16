import { Dialog, DialogTrigger, Button, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Field, ProgressBar } from "@fluentui/react-components";
import Sample from "../../types/Sample";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteSampleAsync } from "../../store/slices/SearchSlice";
import Styles from "./DeleteSample.style";

interface DeleteProps {
    sample: Sample;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DeleteSample = (props: DeleteProps) => {

    // style
    const classes = Styles();

    // control the dialog visibility
    const { sample, open, setOpen } = props;

    // Redux
    const search = useSelector((state: RootState) => state.search);
    const dispatch: AppDispatch = useDispatch();

    // handle close and reset of the dialog
    const onClose = () => {
        
        setOpen(false);
    };

    // handle deletion of the sample and close the dialog
    const handleClose = (target: string) => {
        if (target === 'delete') {
            // delete the sample
            dispatch(deleteSampleAsync(sample.id.toString()));
        }
        if (target === 'cancel') {    
            onClose();
        }
    };

    if (!open) return null;

    return (
        <Dialog modalType="modal" open={open} onOpenChange={(event, data) => {
            //console.log(`data.open: ${data.open} with type: ${data.type} and event ${data.event.currentTarget.id}`);
            if (data.open === false && data.type === 'triggerClick') {
                handleClose(data.event.currentTarget.id);
            }
        }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Delete this Sample?</DialogTitle>
                    <DialogContent>
                        {search.delete.status === 'failed' &&
                            <>
                            <p className={classes.error}>Failed to delete the sample. Please try again.</p>
                            <code>{search.delete.error}</code>                            
                            </>
                        }
                        {search.delete.status === 'loading' &&
                            <Field validationMessage="Deleting the record, please wait ..." validationState="none">
                                <ProgressBar />
                            </Field>
                        }
                        {(search.delete.status === 'idle' || search.delete.status === 'succeeded') &&
                            <p>You are going to delete the sample <strong>{sample.name}</strong>. Are you sure?</p>
                        }

                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button id="delete" appearance="primary" disabled={search.delete.status === 'loading'}>
                                Delete
                            </Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button id="cancel" appearance="secondary" disabled={search.delete.status === 'loading'}>Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default DeleteSample;