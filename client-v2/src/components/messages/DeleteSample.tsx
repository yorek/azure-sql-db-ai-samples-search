import { Dialog, DialogTrigger, Button, DialogSurface, DialogBody, DialogTitle, DialogContent, Checkbox, DialogActions, Field, ProgressBar } from "@fluentui/react-components";
import Sample from "../../types/Sample";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteSampleAsync, resetDeleteState } from "../../store/slices/SearchSlice";
import { getTotalSamplesAsync } from "../../store/slices/HomeSlice";
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

    // handle deletion of the sample and close the dialog
    const handleClose = (target: string) => {
        if (target === 'delete') {
            // delete the sample
            dispatch(deleteSampleAsync(sample.id.toString()));

            // wait until done
            while (search.delete.status === 'loading') {
                // wait
            }
            // error keep it open
            if (search.delete.status === 'failed') {
                return;
            }
        }
        // done, reset and reload total
        dispatch(resetDeleteState());
        dispatch(getTotalSamplesAsync());
        setOpen(false);
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
                            <Button id="delete" appearance="primary">
                                Delete
                            </Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button id="cancel" appearance="secondary">Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default DeleteSample;