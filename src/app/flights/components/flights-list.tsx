// ======= utils, types ======= //
import { Flight } from '../types/Flight.type'
import { Paths } from '../types/Paths.type'
import transformDate from 'src/utils/transform-date'

// =======  helpers ======= //
import { useTranslation } from 'react-i18next';

// ======= mui ======= //
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import { Button, Fade, Modal, Stack, TextField, Typography } from '@mui/material'

import * as Yup from 'yup'

// ======= components ======= //
import FlightItem from './flight-item'
import transformPrice from 'src/utils/transform-price';
import { useState } from 'react';
import { useFormik } from 'formik';
import FormWrapper from 'src/app/auth/components/form-wrapper';
import useRepository from 'src/hooks/useRepositiry';
import { LoadingButton } from '@mui/lab';
import CompletedMarkComponent from './completed-mark.component';
interface Props {
    flightList: Paths
}

export default function FlightsList({ flightList }: Props) {
    const [start_date, start_time] = transformDate({ date: flightList.start_date })
    const [end_date, end_time] = transformDate({ date: flightList.end_date })

    const [isCreated, setIsCreated] = useState<boolean>(false)
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setIsCreated(false)
        }, 500)
    };
    const totalPrice = transformPrice(flightList.totalPrice)
    const [isLoading, errors, data, fetchData] = useRepository()
    const SigninSchema = Yup.object().shape({
        holder_first_name: Yup.string().required('Required'),
        holder_last_name: Yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            holder_first_name: '',
            holder_last_name: '',
        },
        validationSchema: SigninSchema,
        onSubmit: async (value) => {
            const body = {
                ...value,
                flights: flightList.paths.map(it => it.id)
            }
            const res = await fetchData('/ticket', 'post', body)
            if (res.data) {
                setIsCreated(true)
                setTimeout(() => {
                    handleClose()
                }, 1000)
                formik.resetForm()
            }
        },
    });

    return (
        <>
            <Stack direction='row' className='flights-element-stack'>
                <Stack className='price-stack' gap={3}>
                    <Typography variant='h1'>{totalPrice}</Typography>
                    <Button variant='contained' onClick={handleOpen} color='success'>{t('flights.add_button')}</Button>
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                    >
                        <Fade in={open} >
                            <Stack className='create-order-stack'>
                                {isCreated ? <CompletedMarkComponent />
                                    :
                                    <FormWrapper onSubmit={formik.handleSubmit}>
                                        <Typography variant='h2'>{t('flights.creds')}</Typography>
                                        <TextField
                                            variant='outlined'
                                            color='secondary'
                                            fullWidth
                                            id="holder_first_name"
                                            name="holder_first_name"
                                            label={t('flights.holder_fn')}
                                            placeholder={t('flights.holder_fn_placeholder')}
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.holder_first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.holder_first_name && Boolean(formik.errors.holder_first_name)}
                                            helperText={formik.touched.holder_first_name && formik.errors.holder_first_name}
                                        />
                                        <TextField
                                            variant='outlined'
                                            color='secondary'
                                            fullWidth
                                            id="holder_last_name"
                                            name="holder_last_name"
                                            label={t('flights.holder_ln')}
                                            placeholder={t('flights.holder_ln_placeholder')}
                                            InputLabelProps={{ shrink: true }}
                                            value={formik.values.holder_last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.holder_last_name && Boolean(formik.errors.holder_last_name)}
                                            helperText={formik.touched.holder_last_name && formik.errors.holder_last_name}
                                        />

                                        <LoadingButton loading={isLoading} variant='contained' type="submit">{t('flights.create_button')}</LoadingButton>
                                    </FormWrapper>
                                }
                            </Stack>
                        </Fade>
                    </Modal>
                </Stack>
                {flightList.paths.length ?
                    <Stack direction='row' className='path-stack'>
                        <Stack alignItems={'center'} textAlign={'center'}>
                            <Typography variant='h2'>{start_time}</Typography>
                            <Typography variant='h5'>{start_date}</Typography>
                            <Typography variant='h5'>{flightList.from_city}</Typography>
                        </Stack>
                        <Stack direction='column' className='path-stack-outlook'>
                            <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '2px' }}>
                                <FlightTakeoffIcon />
                                <FlightLandIcon />
                            </Stack>
                            <Stack direction='row' className='path-transfers-stack'>
                                {flightList.paths.map((flight: Flight) => {
                                    return <FlightItem key={flight.id} flight={flight} />
                                })}
                            </Stack>
                        </Stack>
                        <Stack alignItems={'center'} textAlign={'center'}>
                            <Typography variant='h2'>{end_time}</Typography>
                            <Typography variant='h5'>{end_date}</Typography>
                            <Typography variant='h5'>{flightList.to_city}</Typography>
                        </Stack>
                    </Stack>
                    :
                    null}
            </Stack>
        </>
    )
}
