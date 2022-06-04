import { useTranslation } from 'react-i18next';
import { useState, createContext } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const CT0003Dialog = createContext({});
export default CT0003Dialog;

export const CT0003DialogProvider = ({
    children,
}) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const initialDialog = {
        title: 'DialogTitle',
        content: '',
        formArea: null,
        cancelButtonName: 'Cancel',
        submitButtonName: t('Subscribe'),
        onSubmit: () => {},
    }
    const [dialog, setDialog] = useState(initialDialog);

    const openDialog = (dialog) => {
        setDialog({...initialDialog, ...dialog});
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        dialog.onSubmit();
        handleClose();
    };

    const value = {
        openDialog
    }

    return (
        <CT0003Dialog.Provider value={value}>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { dialog.content }
                </DialogContentText>
                { dialog.formArea }
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{ dialog.cancelButtonName }</Button>
              <Button onClick={handleSubmit}>{ dialog.submitButtonName }</Button>
            </DialogActions>
          </Dialog>
          { children }
        </CT0003Dialog.Provider>
    );
};

