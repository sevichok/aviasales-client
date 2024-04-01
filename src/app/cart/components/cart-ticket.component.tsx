import { useState } from 'react';
import useRepository from 'src/hooks/useRepositiry';

// ======= utils, helpers ======= //
import { useTranslation } from "react-i18next"

// ======= store ======= //
import { useAppDispatch } from 'src/storeTypes';
import { getTickets } from '../store/cart.actions';

// ======= utils, types ======= //
import { Ticket } from '../types/Ticket.type'

// ======= mui ======= //
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import { LoadingButton } from '@mui/lab';

// ======= components ======= //
import AlertMessage from 'src/components/alert-message';
import transformPrice from 'src/utils/transform-price';
interface Props {
    ticket: Ticket
}
export default function CartTicketComponent({ ticket }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false)
    const [isLoading, errors, data, fetchData] = useRepository()
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const handleAgree = async () => {
        await fetchData(`/ticket/${ticket.id}`, 'delete')
        dispatch(getTickets())
        handleClose()
    }

    const price = transformPrice(ticket.flight.price)
    return (
        <>
            <Card className='ticket-card'>
                <CardContent>
                    <Typography variant='h2' >
                        {ticket.holder_first_name} {ticket.holder_last_name}
                    </Typography>
                    <Typography variant='h5' paddingTop={'3px'}>
                        {t('cart.from')}: {ticket.flight.from_city.title}
                    </Typography>
                    <Typography variant='h5' paddingTop={'3px'}>
                        {t('cart.to')}: {ticket.flight.to_city.title}
                    </Typography>
                    <Typography variant='h5' paddingTop={'3px'}>
                        {t('cart.price')}: {price}
                    </Typography>
                    <Typography variant='h5' paddingTop={'3px'}>
                        {t('cart.status')}: {ticket.status}
                    </Typography>
                </CardContent>
                <CardActions>
                    <ClearIcon onClick={() => setOpen(true)} />
                </CardActions>
            </Card>
            {errors ? <AlertMessage errorMessage={errors} /> : null}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ fontSize: 20 }}>
                        {t('cart.dialog_title')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={handleClose} variant='contained' color='success' className='disagreeBtn'>
                        {t('cart.dialog_back')}
                    </Button>
                    <LoadingButton loading={isLoading} variant='contained' color='error' onClick={handleAgree} autoFocus>
                        {t('cart.dialog_delete')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
