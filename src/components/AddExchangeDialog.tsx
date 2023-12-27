import { FC } from 'react';
import KeyForm from './KeyForm';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface AddExchangeDialogProps {}

const AddExchangeDialog: FC<AddExchangeDialogProps> = ({}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add new Exchange</DialogTitle>
        <DialogDescription>Add new exchange to your portfolio. </DialogDescription>
      </DialogHeader>

      <div>
        <KeyForm />
      </div>
    </DialogContent>
  );
};

export default AddExchangeDialog;
