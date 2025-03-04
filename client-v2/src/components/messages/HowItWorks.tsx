import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";
import React from "react";

interface HowItWorksProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({open, setOpen}) => {
    // const handleClose = () => {
    //     setOpen(false);
    //   };

if (!open) return null;

    return (
        <Dialog modalType="non-modal" open={true}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem cumque repellendus eaque est dolor eius expedita
                        nulla ullam? Tenetur reprehenderit aut voluptatum impedit voluptates
                        in natus iure cumque eaque?
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default HowItWorks;